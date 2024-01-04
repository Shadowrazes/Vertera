import Entity from "./Entity.js";

class Attachment extends Entity {
    static TableName = 'attachments';
    static PrimaryField = 'id';
    static MessageIdField = 'messageId'
    static PathField = 'path';

    static AddMd5Name(res) {
        for(const attach of res){
            const path = attach.path;
            attach.name = path.substring(path.lastIndexOf('/') + 1);
        }

        return res;
    }

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return this.AddMd5Name(result)[0];
    }

    static async GetListByMsg(messageId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.MessageIdField} = ?`;
        const result = await super.Request(sql, [messageId]);
        return this.AddMd5Name(result);
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