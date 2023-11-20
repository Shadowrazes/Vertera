import AttachmentEntity from "./Attachment.js";
import Entity from "./Entity.js";

class MessageEntity extends Entity{
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
        const sql = `SELECT * from ${this.TableName} WHERE ${this.TicketIdField} = ?`;
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
                const attachResult = await AttachmentEntity.TransInsert(conn, result.insertId, args.attachPaths);
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

    static async Update(id) {

    }

    static async Delete(id) {

    }
}

export default MessageEntity;