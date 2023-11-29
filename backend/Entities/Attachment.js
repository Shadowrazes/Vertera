import Entity from "./Entity.js";

class Attachment extends Entity {
    static TableName = 'attachments';
    static PrimaryField = 'id';
    static MessageIdField = 'messageId'
    static PathField = 'path';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListByMsg(messageId) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.MessageIdField} = ?`;
        const result = await super.Request(sql, [messageId]);
        return result;
    }

    static async TransInsert(conn, messageId, attachs) {
        let insertIds = [];
        for(const path of attachs){
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {messageId, path};
            const result = await super.TransRequest(conn, sql, [fields]);
            insertIds.push(result.insertId);
        }
        return insertIds;
    }
}

export default Attachment;