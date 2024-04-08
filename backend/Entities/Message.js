import Attachment from "./Attachment.js";
import Entity from "./Entity.js";
import Client from "./Client.js";
import User from "./User.js";
import Ticket from "./Ticket.js";
import EmailSender from "../Utils/EmailSender.js";
import TicketLog from "./TicketLog.js";
import Errors from "../Utils/Errors.js";

class Message extends Entity {
    static TableName = 'messages';
    static PrimaryField = 'id';
    static SenderIdField = 'senderId';
    static RecieverIdField = 'recieverId';
    static AttachmentIdField = 'attachmentId';
    static TicketIdField = 'ticketId';
    static TypeField = 'type';
    static ReadField = 'readed';
    static TextField = 'text';
    static DateField = 'date';
    static VisibilityField = 'visibility';
    static IsActiveField = 'isActive';

    static TypeDefault = 'common';
    static TypeSystem = 'system';

    static VisibleByAll = 1;
    static VisibleByHelpers = 2;

    static ClientAllowedStatusIds = [1, 5];

    static async GetById(id, initiator) {
        let sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        if (initiator.role == User.RoleClient) {
            sql += ` 
                AND ${this.VisibilityField} < ${this.VisibleByHelpers}
                AND ${this.IsActiveField} <> 0
            `;
        }
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListByTicket(ticketId, initiator) {
        let sql = `SELECT * FROM ${this.TableName} WHERE ${this.TicketIdField} = ?`;
        if (initiator.role == User.RoleClient) {
            sql += ` 
                AND ${this.VisibilityField} < ${this.VisibleByHelpers}
                AND ${this.IsActiveField} <> 0
            `;
        }
        const result = await super.Request(sql, [ticketId]);

        for (let i = result.length - 1; i >= 0; i--) {
            if (result[i].senderId === initiator.id) {
                result[i].removable = true;
            } else {
                break;
            }
        }

        return result;
    }

    static async CopyByTicket(ticketId) {
        return 0;
        return await super.Transaction(async (conn) => {
            const curTicket = await Ticket.GetById(ticketId);
            if (curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            const parentMessages = await this.GetListByTicket(ticketId);

            const firstMsg = parentMessages.shift();
            const firstMsgAttachs = await Attachment.GetListByMsg(firstMsg.id);

            firstMsgAttachs.forEach((item) => {
                delete item.name;
            });

            return 0;
        });
    }

    static async TransInsert(args, conn) {
        const transFunc = async (conn) => {
            let curTicket = await Ticket.GetById(args.ticketId);
            const isFirstMsg = curTicket == undefined;

            if (isFirstMsg) {
                curTicket = await Ticket.TransGetById(conn, args.ticketId);
            }

            // Если тикет - уведомление или закрыт, писать запрещено
            if (curTicket.statusId == Ticket.StatusIdClosed) throw new Error(Errors.MsgInClosedTicket);
            if (!isFirstMsg && curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            const sender = await User.GetById(args.senderId);
            if (sender.role == User.RoleClient && !this.ClientAllowedStatusIds.includes(curTicket.statusId)) {
                throw new Error(Errors.MsgSendForbidden);
            }

            const allowedSenderIds = [
                curTicket.initiatorId,
                curTicket.recipientId,
                curTicket.assistantId,
                User.AdminId
            ];
            if (!allowedSenderIds.includes(sender.id)) {
                throw new Error(Errors.MsgSendForbidden);
            }

            let visibility = this.VisibleByAll;
            if (curTicket.statusId == Ticket.StatusIdOnRevision && sender.role == User.RoleHelper) {
                visibility = this.VisibleByHelpers;
            }

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {
                senderId: args.senderId, recieverId: args.recieverId, type: args.type, readed: 0,
                ticketId: args.ticketId, text: args.text, date: new Date(), visibility
            };

            const result = await super.TransRequest(conn, sql, [fields]);

            if (args.attachPaths) {
                const attachResult = await Attachment.TransInsert(conn, result.insertId, args.attachPaths);
            }

            const reciever = await User.GetById(args.recieverId);

            const msgLogFields = {
                type: TicketLog.TypeMsgSend, ticketId: args.ticketId,
                info: `Отправил сообщение`, initiatorId: args.senderId
            };
            const msgLogRes = await TicketLog.TransInsert(conn, msgLogFields);

            if (!isFirstMsg) {
                const curReciever = await User.GetById(reciever.id);

                if (curTicket.initiatorId != curReciever.id && curTicket.recipientId != curReciever.id) {
                    throw new Error(Errors.IncorrectMsgReciever);
                }

                const dialogLink = `https://help.vertera.org/dialog/${curTicket.link}/`
                const emailText = `Новое сообщение в обращении.\nУвидеть его вы можете по ссылке: ${dialogLink}`;
                EmailSender.Notify(curReciever.email, emailText);
            }

            return result.insertId;
        };

        if (!conn) {
            return await super.Transaction(async (conn) => {
                return await transFunc(conn);
            });
        }
        else {
            return await transFunc(conn);
        }
    }

    static async TransUpdate(id, fields, initiator) {
        return await super.Transaction(async (conn) => {
            if (super.IsArgsEmpty(fields)) throw new Error(Errors.EmptyArgsFields);

            const curMsg = await this.GetById(id, initiator);
            if (curMsg.senderId != initiator.id) throw new Error(Errors.UpdNotOwnMsg);

            const curTicket = await Ticket.GetById(curMsg.ticketId);

            if (fields.isActive != undefined) {
                let msgUpdLogFields = { ticketId: curTicket.id, initiatorId: initiator.id };

                if (!fields.isActive) {
                    msgUpdLogFields.type = TicketLog.TypeMsgDel;
                    msgUpdLogFields.info = `Удалил сообщение`;
                }
                else {
                    msgUpdLogFields.type = TicketLog.TypeMsgRecover;
                    msgUpdLogFields.info = `Восстановил сообщение`;
                }

                const msgUpdLogRes = await TicketLog.TransInsert(conn, msgUpdLogFields);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [fields, id]);

            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    static async DeleteCascade(id, initiator) {
        return await super.Transaction(async (conn) => {
            const curMsg = await this.GetById(id, initiator);
            if (curMsg.senderId != initiator.id) throw new Error(Errors.UpdNotOwnMsg);

            const curTicket = await Ticket.GetById(curMsg.ticketId);

            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const msgDelLogFields = {
                type: TicketLog.TypeMsgDel, ticketId: curTicket.id,
                info: `Удалил сообщение`, initiatorId: initiator.id
            };
            const msgDelLogRes = await TicketLog.TransInsert(conn, msgDelLogFields);

            return result.affectedRows;
        });
    }
}

export default Message;