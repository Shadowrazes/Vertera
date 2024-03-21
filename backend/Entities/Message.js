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

    static TypeDefault = 'common';
    static TypeSystem = 'system';

    static VisibleByAll = 1;
    static VisibleByHelpers = 2;

    static ClientAllowedStatusIds = [1, 5];

    static async GetById(id, initiator) {
        let sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        if(initiator.role == User.RoleClient){
            sql += ` AND ${this.VisibilityField} < ${this.VisibleByHelpers}`;
        }
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListByTicket(ticketId, initiator) {
        let sql = `SELECT * FROM ${this.TableName} WHERE ${this.TicketIdField} = ?`;
        if(initiator.role == User.RoleClient){
            sql += ` AND ${this.VisibilityField} < ${this.VisibleByHelpers}`;
        }
        const result = await super.Request(sql, [ticketId]);
        return result;
    }

    static async TransInsert(args, conn) {
        const transFunc = async (conn) => {
            const curTicket = await Ticket.GetById(args.ticketId);
            
            if (curTicket && curTicket.statusId == Ticket.StatusIdClosed) throw new Error(Errors.MsgInClosedTicket);
            if (curTicket && curTicket.statusId == this.StatusIdNotification) throw new Error(Errors.UpdateOfNotificationTicket);

            const sender = await User.GetById(args.senderId);
            if (curTicket && sender.role == User.RoleClient && !this.ClientAllowedStatusIds.includes(curTicket.statusId)) {
                throw new Error(Errors.MsgSendForbidden);
            }

            if(curTicket){
                const allowedSenderIds = [
                    curTicket.initiatorId,
                    curTicket.recipientId,
                    curTicket.assistantId,
                    User.AdminId
                ];
                if (!allowedSenderIds.includes(sender.id)) 
                {
                    throw new Error(Errors.MsgSendForbidden);
                }
            }

            let visibility = this.VisibleByAll;
            if (curTicket && curTicket.statusId == Ticket.StatusIdOnRevision && sender.role == User.RoleHelper){
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

            if (reciever.role == User.RoleClient) {
                const curClient = await Client.GetById(reciever.id);

                if (curTicket.initiatorId != curClient.id && curTicket.recipientId != curClient.id){
                    throw new Error(Errors.IncorrectMsgReciever);
                }

                const dialogLink = `https://help.vertera.org/dialog/${curTicket.link}/`
                const emailText = `На ваше обращение дан ответ.\nУвидеть его вы можете по ссылке: ${dialogLink}`;
                EmailSender.Notify(curClient.email, emailText);
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

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if (super.IsArgsEmpty(fields)) throw new Error(Errors.EmptyArgsFields);

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [fields, id]);

            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    static async Delete(id) {

    }
}

export default Message;