import Entity from "./Entity.js";
import Helper from "./Helper.js";
import Message from "./Message.js";
import User from "./User.js";

class Ticket extends Entity{
    static TableName = 'tickets';
    static PrimaryField = 'id';
    static ClientIdField = 'clientId';
    static HelperIdField = 'helperId';
    static StatusIdField = 'statusId';
    static DateField = 'date';
    static UnitField = 'unitId';
    static ThemeField = 'themeId';
    static SubThemeField = 'subThemeId';
    static ReactionField = 'reaction';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetLastMsg(ticketId) {
        const sql = `
        SELECT * FROM ${Message.TableName} 
        WHERE ${Message.TicketIdField} = ? 
        ORDER BY ${Message.DateField} DESC LIMIT 1
        `;
        const result = await super.Request(sql, [ticketId]);   
        return result[0];
    }

    static async GetMsgStats(ticketId) {
        const sql = `
        SELECT COUNT(*) AS total, SUM(IF(${Message.TableName}.${Message.ReadField} = 0, 1, 0)) AS unread
        FROM ${Message.TableName} WHERE ${Message.TicketIdField} = ?;
        `;
        const result = await super.Request(sql, [ticketId]);   
        return result[0];
    }

    static async GetList(filter) {
        const usersClientAS = 'clies';
        const usersHelperAS = 'helps';
        const clientCountryAS = 'clientCountry';
        const helperCountryAS = 'helperCountry';

        // SUM(IF(messages.readed = 0, 1, 0)) AS unreadMsg
        let sql = `
        SELECT  ${this.TableName}.${this.PrimaryField}, ${this.TableName}.${this.ClientIdField}, 
                ${this.TableName}.${this.HelperIdField}, ${this.TableName}.${this.StatusIdField}, 
                ${this.TableName}.${this.DateField}, ${this.TableName}.${this.UnitField}, 
                ${this.TableName}.${this.ThemeField}, ${this.TableName}.${this.SubThemeField},
                ${this.TableName}.${this.ReactionField}, 
                ${usersClientAS}.${User.CountryIdField} AS ${clientCountryAS},
                ${usersHelperAS}.${User.CountryIdField} AS ${helperCountryAS},
                MAX(messages.date) AS lastMsgDate, 
                COUNT(messages.id) AS totalMsg

        FROM    ${this.TableName} 

        JOIN    ${User.TableName} AS ${usersClientAS} 
                ON ${this.TableName}.${this.ClientIdField} = ${usersClientAS}.id

        JOIN    ${User.TableName} AS ${usersHelperAS} 
                ON ${this.TableName}.${this.HelperIdField} = ${usersHelperAS}.id

        JOIN    ${Message.TableName} 
                ON ${this.TableName}.${this.PrimaryField} = ${Message.TableName}.${Message.TicketIdField}

        WHERE   1=1
        `;

        let fields = [];
        if (filter.unitIds && filter.unitIds.length > 0) {
            sql += ` AND ${this.UnitField} IN (?)`;
            fields.push(filter.unitIds);
        }
        if (filter.themeIds && filter.themeIds.length > 0) {
            sql += ` AND ${this.ThemeField} IN (?)`;
            fields.push(filter.themeIds);
        }
        if (filter.subThemeIds && filter.subThemeIds.length > 0) {
            sql += ` AND ${this.SubThemeField} IN (?)`;
            fields.push(filter.subThemeIds);
        }
        if (filter.helperIds && filter.helperIds.length > 0) {
            sql += ` AND ${this.HelperIdField} IN (?)`;
            fields.push(filter.helperIds);
        }
        if (filter.helperCountryIds && filter.helperCountryIds.length > 0) {
            sql += ` AND ${usersHelperAS}.${User.CountryIdField} IN (?)`;
            fields.push(filter.helperCountryIds);
        }
        if (filter.clientCountryIds && filter.clientCountryIds.length > 0) {
            sql += ` AND ${usersClientAS}.${User.CountryIdField} IN (?)`;
            fields.push(filter.clientCountryIds);
        }
        if (filter.replyed != undefined) {
            sql += ` 
            AND ${this.ClientIdField} = (
                SELECT ${Message.SenderIdField}
                FROM ${Message.TableName}
                WHERE ${Message.DateField} = (
                    SELECT MAX(${Message.DateField}) 
                    FROM ${Message.TableName} 
                    WHERE ${Message.TicketIdField} ${!filter.replyed ? '=' : '<>'} ${this.TableName}.${this.PrimaryField})
                )
            `;
        }
        if (filter.statusIds && filter.statusIds.length > 0) {
            sql += ` AND ${this.StatusIdField} IN (?)`;
            fields.push(filter.statusIds);
        }
        if (filter.date) {
            sql += ` AND ${this.TableName}.${this.DateField} = ?`;
            fields.push(filter.date);
        }
        if (filter.reaction) {
            sql += ` AND ${this.ReactionField} = ?`;
            fields.push(filter.reaction);
        }
  
        sql += ` GROUP BY ${this.TableName}.${this.PrimaryField}`;
        sql += ` ORDER BY ? ?`;
        sql += ` LIMIT ? OFFSET ?`;

        fields.push(filter.orderBy, filter.orderDir, filter.limit, filter.offset);
        return await super.Request(sql, fields);
    }

    static async TransInsert(args) {
        return await super.Transaction(async (conn) => {
            const ticketFields = args.ticketFields;
            const messageFields = args.messageFields;

            const helperId = await Helper.GetMostFreeHelper(ticketFields.subThemeId);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {clientId: ticketFields.clientId, helperId, date: new Date(), unitId: ticketFields.unitId, 
                            themeId: ticketFields.themeId, subThemeId: ticketFields.subThemeId, statusId: 1};
            const result = await super.TransRequest(conn, sql, [fields]);
            
            messageFields.recieverId = helperId;
            messageFields.ticketId = result.insertId;
            const messageResult = await Message.TransInsert(messageFields, conn);

            const helperResult = await User.GetById(helperId);
            const helperFullNameSplit = helperResult.fullName.trim().split(' ');
            const helperName = helperFullNameSplit.length > 1 ? helperFullNameSplit[1] : helperFullNameSplit[0];

            const msgSysFields = { senderId: 0, recieverId: ticketFields.clientId, type: 'system', readed: 0,
                                   ticketId: result.insertId, text: `Вашим вопросом занимается ${helperName}`};
            const msgSysResult = await Message.TransInsert(msgSysFields, conn);

            return result.insertId;
        });
    }

    static async TransUpdate(id, fields, departmentId) {
        return await super.Transaction(async (conn) => {
            if(!fields.helperId && departmentId) {
                fields.helperId = await Helper.GetMostFreeHelper(fields.subThemeId, departmentId);
            }
    
            if(fields.helperId) {
                const clientResult = await this.GetById(id);
                const clientId = clientResult.clientId;

                const helperResult = await User.GetById(fields.helperId);
                const helperFullNameSplit = helperResult.fullName.trim().split(' ');
                const helperName = helperFullNameSplit.length > 1 ? helperFullNameSplit[1] : helperFullNameSplit[0];
    
                const msgFields = { senderId: 0, recieverId: clientId, type: 'helperChange', readed: 0,
                                    ticketId: id, text: `Вашим вопросом занимается ${helperName}` };
                const msgResult = await Message.TransInsert(msgFields, conn);
            }
    
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [fields, id]);
            return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
        });
    }

    // Cascade deleting Ticket & Ticket Messages & Messages attachs
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default Ticket;