import Attachment from "./Attachment.js";
import Entity from "./Entity.js";
import Client from "./Client.js";
import User from "./User.js";
import Ticket from "./Ticket.js";
import EmailSender from "../Utils/EmailSender.js";
import TicketLog from "./TicketLog.js";

class Message extends Entity{
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

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListByTicket(ticketId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.TicketIdField} = ?`;
        const result = await super.Request(sql, [ticketId]);
        return result;
    }

    static async TransInsert(args, conn) {
        const transFunc = async (conn, args) => {
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {senderId: args.senderId, recieverId: args.recieverId, type: args.type, readed: 0,
                            ticketId: args.ticketId, text: args.text, date: new Date(), };

            const result = await super.TransRequest(conn, sql, [fields]);
            if(args.attachPaths){
                const attachResult = await Attachment.TransInsert(conn, result.insertId, args.attachPaths);
            }

            const sender = await User.GetById(args.senderId);
            const reciever = await User.GetById(args.recieverId);

            const msgLogFields = { type: 'msgSend', ticketId: args.ticketId, info: `Отправил сообщение`, initiatorId: args.senderId};
            const msgLogRes = await TicketLog.TransInsert(conn, msgLogFields);

            if(sender.role == 'helper' && reciever.role != 'helper'){
                const curTicket = await Ticket.GetById(args.ticketId);
                const curClient = await Client.GetById(args.recieverId);

                if(curTicket.clientId != curClient.id) throw new Error('Incorrect msg reciever');

                const dialogLink = `https://vticket.yasanyabeats.ru/dialog/${curTicket.link}/`
                const emailText = `На ваше обращение дан ответ.\nУвидеть его вы можете по ссылке: ${dialogLink}`;
                EmailSender.Notify(curClient.email, emailText);
            }

            return result.insertId;
        };

        if(!conn){
            return await super.Transaction(async (conn) => {
                return await transFunc(conn, args);
            });
        }
        else{
            return await transFunc(conn, args);
        }
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if(super.IsArgsEmpty(fields)) throw new Error('Empty fields');

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [fields, id]);

            return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
        });
    }

    static async Delete(id) {

    }
}

export default Message;