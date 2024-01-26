import Entity from "./Entity.js";

class TicketLog extends Entity{
    static TableName = 'tickets_log';
    static PrimaryField = 'id';
    static DateField = 'date';
    static TypeField = 'type';
    static TicketIdField = 'ticketId';
    static InitiatorIdField = 'initiatorId';
    static InfoField = 'info';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListByTicket(ticketId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.TicketIdField} = ?`;
        const result = await super.Request(sql, [ticketId]);
        return result;
    }

    static async TransInsert(conn, fields) {
        fields.date = new Date();
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const result = await super.TransRequest(conn, sql, [fields]);
        return result.insertId;
    }
}

export default TicketLog;