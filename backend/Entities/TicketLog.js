import Entity from "./Entity.js";

class TicketLog extends Entity{
    static TableName = 'tickets_log';
    static PrimaryField = 'id';
    static DateField = 'date';
    static TypeField = 'type';
    static TicketIdField = 'ticketId';
    static InitiatorIdField = 'initiatorId';
    static InfoField = 'info';

    static TypeCreate = 'create';
    static TypeMsgSend = 'msgSend';
    static TypeMsgDel = 'msgDelete';
    static TypeMsgRecover = 'msgRecover';
    static TypeSplit = 'split';
    static TypeDepChange = 'depChange';
    static TypeHelperAssign = 'helperAssign';
    static TypeStatusChange = 'statusChange';
    static TypeSplitCreate = 'splitCreate';
    static TypeClientReaction = 'clientReaction';
    static TypeThemeChange = 'themeChange';
    static TypeTitleChange = 'titleChange';
    static TypeAssistantConn = 'assistantConn';
    static TypeInitiatorChange = 'initiatorChange';
    static TypeRecipientChange = 'recipientChange';
    static TypeRedirectToMentor = 'mentorRedirect';

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