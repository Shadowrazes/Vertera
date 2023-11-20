import Entity from "./Entity.js";
import HelperEntity from "./Helper.js";
import MessageEntity from "./Message.js";
import UserEntity from "./User.js";

class TicketEntity extends Entity{
    static TableName = 'tickets';
    static PrimaryField = 'id';
    static ClientIdField = 'clientId';
    static HelperIdField = 'helperId';
    static StatusField = 'status';
    static DateField = 'date';
    static UnitField = 'unitId';
    static ThemeField = 'themeId';
    static SubThemeField = 'subThemeId';
    static ReactionField = 'reaction';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetLastMsg(ticketId) {
        const sql = `
        SELECT * FROM ${MessageEntity.TableName} 
        WHERE ${MessageEntity.TicketIdField} = ? 
        ORDER BY ${MessageEntity.DateField} DESC LIMIT 1
        `;
        const result = await super.Request(sql, [ticketId]);   
        return result[0];
    }

    static async GetMsgStats(ticketId) {
        const sql = `
        SELECT COUNT(*) AS total, SUM(IF(${MessageEntity.TableName}.${MessageEntity.ReadField} = 0, 1, 0)) AS unread
        FROM ${MessageEntity.TableName} WHERE ${MessageEntity.TicketIdField} = ?;
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
                ${this.TableName}.${this.HelperIdField}, ${this.TableName}.${this.StatusField}, 
                ${this.TableName}.${this.DateField}, ${this.TableName}.${this.UnitField}, 
                ${this.TableName}.${this.ThemeField}, ${this.TableName}.${this.SubThemeField},
                ${this.TableName}.${this.ReactionField}, 
                ${usersClientAS}.${UserEntity.CountryField} AS ${clientCountryAS},
                ${usersHelperAS}.${UserEntity.CountryField} AS ${helperCountryAS},
                MAX(messages.date) AS lastMsgDate, 
                COUNT(messages.id) AS totalMsg

        FROM    ${this.TableName} 

        JOIN    ${UserEntity.TableName} AS ${usersClientAS} 
                ON ${this.TableName}.${this.ClientIdField} = ${usersClientAS}.id

        JOIN    ${UserEntity.TableName} AS ${usersHelperAS} 
                ON ${this.TableName}.${this.HelperIdField} = ${usersHelperAS}.id

        JOIN    ${MessageEntity.TableName} 
                ON ${this.TableName}.${this.PrimaryField} = ${MessageEntity.TableName}.${MessageEntity.TicketIdField}

        WHERE   1=1
        `;

        let fields = [];
        if (filter.unitId && filter.unitId.length > 0) {
            sql += ` AND ${this.UnitField} IN (?)`;
            fields.push(filter.unitId);
        }
        if (filter.themeId && filter.themeId.length > 0) {
            sql += ` AND ${this.ThemeField} IN (?)`;
            fields.push(filter.themeId);
        }
        if (filter.subThemeId && filter.subThemeId.length > 0) {
            sql += ` AND ${this.SubThemeField} IN (?)`;
            fields.push(filter.subThemeId);
        }
        if (filter.helperName && filter.helperName.length > 0) {
            sql += ` AND ${this.HelperIdField} IN (?)`;
            fields.push(filter.helperName);
        }
        if (filter.helperCountries && filter.helperCountries.length > 0) {
            sql += ` AND ${usersHelperAS}.${UserEntity.CountryField} IN (?)`;
            fields.push(filter.helperCountries);
        }
        if (filter.clientCountries && filter.clientCountries.length > 0) {
            sql += ` AND ${usersClientAS}.${UserEntity.CountryField} IN (?)`;
            fields.push(filter.clientCountries);
        }
        if (filter.replyed != undefined) {
            sql += ` 
            AND ${this.ClientIdField} = (
                SELECT ${MessageEntity.SenderIdField}
                FROM ${MessageEntity.TableName}
                WHERE ${MessageEntity.DateField} = (
                    SELECT MAX(${MessageEntity.DateField}) 
                    FROM ${MessageEntity.TableName} 
                    WHERE ${MessageEntity.TicketIdField} ${!filter.replyed ? '=' : '<>'} ${this.TableName}.${this.PrimaryField})
                )
            `;
        }
        if (filter.status && filter.status.length > 0) {
            sql += ` AND ${this.StatusField} IN (?)`;
            fields.push(filter.status);
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

            const helperId = await HelperEntity.GetMostFreeHelper(ticketFields.subThemeId);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {clientId: ticketFields.clientId, helperId, date: new Date(), unitId: ticketFields.unitId, 
                            themeId: ticketFields.themeId, subThemeId: ticketFields.subThemeId, status: 'Новый'};
            const result = await super.TransRequest(conn, sql, [fields]);
            
            messageFields.recieverId = helperId;
            messageFields.ticketId = result.insertId;
            const messageResult = await MessageEntity.TransInsert(messageFields, conn);

            const helperResult = await UserEntity.GetById(helperId);
            const helperFullNameSplit = helperResult.fullName.trim().split(' ');
            const helperName = helperFullNameSplit.length > 1 ? helperFullNameSplit[1] : helperFullNameSplit[0];

            const msgSysFields = { senderId: 0, recieverId: ticketFields.clientId, type: 'system', readed: 0,
                                   ticketId: result.insertId, text: `Вашим вопросом занимается ${helperName}`};
            const msgSysResult = await MessageEntity.TransInsert(msgSysFields, conn);

            return result.insertId;
        });
    }

    static async TransUpdate(id, fields, departmentId) {
        return await super.Transaction(async (conn) => {
            if(!fields.helperId && departmentId) {
                fields.helperId = await HelperEntity.GetMostFreeHelper(fields.subThemeId, departmentId);
            }
    
            if(fields.helperId) {
                const clientResult = await this.GetById(id);
                const clientId = clientResult.clientId;

                const helperResult = await UserEntity.GetById(fields.helperId);
                const helperFullNameSplit = helperResult.fullName.trim().split(' ');
                const helperName = helperFullNameSplit.length > 1 ? helperFullNameSplit[1] : helperFullNameSplit[0];
    
                const msgFields = { senderId: 0, recieverId: clientId, type: 'system', readed: 0,
                                    ticketId: id, text: `Вашим вопросом занимается ${helperName}` };
                const msgResult = await MessageEntity.TransInsert(msgFields, conn);
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

export default TicketEntity;