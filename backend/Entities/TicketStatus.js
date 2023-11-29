import Entity from "./Entity.js";

class TicketStatus extends Entity{
    static TableName = 'ticket_statuses';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }
}

export default TicketStatus;