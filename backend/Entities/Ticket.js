import Entity from "./Entity.js";
import MessageEntity from "./Message.js";
import UserEntity from "./User.js";

class TicketEntity extends Entity{
    static TableName = 'tickets';
    static PrimaryField = 'id';
    static ClientIdField = 'clientId';
    static HelperIdField = 'helperId';
    static StatusField = 'status';
    static DateField = 'date';
    static UnitField = 'unit';
    static ThemeField = 'theme';
    static SubThemeField = 'subTheme';
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

    static async GetMessages(ticketId) {
        const sql = `
        SELECT * FROM ${MessageEntity.TableName} 
        WHERE ${MessageEntity.TicketIdField} = ?;
        `;
        const result = await super.Request(sql, [ticketId]);   
        return result;
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

        if (filter.unit && filter.unit.length > 0) {
            const units = filter.unit.map(unit => `'${unit}'`).join(',');
            sql += ` AND ${this.UnitField} IN (${units})`;
        }
        if (filter.theme && filter.theme.length > 0) {
            const themes = filter.theme.map(theme => `'${theme}'`).join(',');
            sql += ` AND ${this.ThemeField} IN (${themes})`;
        }
        if (filter.subTheme && filter.subTheme.length > 0) {
            const subThemes = filter.subTheme.map(subTheme => `'${subTheme}'`).join(',');
            sql += ` AND ${this.SubThemeField} IN (${subThemes})`;
        }
        if (filter.helperName && filter.helperName.length > 0) {
            const helperNames = filter.helperName.map(helperName => `'${helperName}'`).join(',');
            sql += ` AND ${this.HelperIdField} IN (${helperNames})`;
        }
        if (filter.helperCountries && filter.helperCountries.length > 0) {
            const helperCountries = filter.helperCountries.map(country => `'${country}'`).join(',');
            sql += ` AND ${usersHelperAS}.${UserEntity.CountryField} IN (${helperCountries})`;
        }
        if (filter.clientCountries && filter.clientCountries.length > 0) {
            const clientCountries = filter.clientCountries.map(country => `'${country}'`).join(',');
            sql += ` AND ${usersClientAS}.${UserEntity.CountryField} IN (${clientCountries})`;
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
            const statuses = filter.status.map(status => `'${status}'`).join(',');
            sql += ` AND ${this.StatusField} IN (${statuses})`;
        }
        if (filter.date) {
            sql += ` AND ${this.DateField} = '${filter.date}'`;
        }
        if (filter.reaction) {
            sql += ` AND ${this.ReactionField} = '${filter.reaction}'`;
        }
  
        sql += ` GROUP BY ${this.TableName}.${this.PrimaryField}`;
        sql += ` ORDER BY ${filter.orderBy} ${filter.orderDir}`;
        sql += ` LIMIT ${filter.limit} OFFSET ${filter.offset}`;

        return await super.Request(sql);
    }

    static async Insert(id, name, role, county) {
        
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default TicketEntity;