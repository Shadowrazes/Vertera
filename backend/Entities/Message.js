import Attachment from "./Attachment.js";
import Entity from "./Entity.js";
import Client from "./Client.js";
import User from "./User.js";
import EmailSender from "../Utils/EmailSender.js";

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

            const userResult = await User.GetById(args.senderId);

            if(userResult.role && userResult.role == 'helper'){
                const clientResult = await Client.GetById(args.recieverId);
                const dialogLink = `https://vertera-ticket.yasanyabeats.ru/dialog/${args.recieverId}/${args.ticketId}/`
                const emailText = `На ваше обрашение дан ответ.\nУвидеть его вы можете по ссылке: ${dialogLink}`;
                EmailSender.Notify(clientResult.email, emailText);
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