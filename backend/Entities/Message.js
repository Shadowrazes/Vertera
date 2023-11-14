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

    static async Insert(args) {
        const res = await super.Transaction(async (conn) => {
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {senderId: args.senderId, recieverId: args.recieverId, type: args.type, readed: 0,
                            ticketId: args.ticketId, text: args.text, date: new Date() };

            console.log(fields);
            const result = await conn.execute(sql, fields).then(res => {
                console.log('fetched');
                return res[0];
            });
            console.log('1');
            if(args.attachPaths){
                const messageId = result.insertId;
                const attachs = args.attachPaths;
                let insertIds = [];
                for(const path of attachs){
                    const sql = `INSERT INTO ${AttachmentEntity.TableName} SET ?`;
                    const fields = {messageId, path};
                    const attachResult = await conn.execute(sql, fields).then(res => {
                        console.log('fetched');
                        return res[0];
                    });
                    insertIds.push(attachResult.insertId);
                }
                console.log(insertIds);
            }
            return result.insertId;
        });
        return res;
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default MessageEntity;