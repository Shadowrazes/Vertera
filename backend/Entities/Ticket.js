import Entity from "./Entity.js";
import MessageEntity from "./Message.js";

class TicketEntity extends Entity{
    static TableName = 'tickets';
    static PrimaryField = 'id';
    static ClientIdField = 'clientId';
    static HelperIdField = 'helpreId';
    static StatusField = 'status';
    static DateField = 'date';
    static UnitField = 'unit';
    static ThemeField = 'theme';
    static SubThemeField = 'subTheme';
    static ReactionField = 'reaction';

    static async Get(id) {
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
        SELECT COUNT(*) AS total, COUNT(*) - SUM(CAST(${MessageEntity.ReadField} AS INT)) AS unread
        FROM ${MessageEntity.TableName}  WHERE ${MessageEntity.TicketIdField} = ?;
        `;
        const result = await super.Request(sql, [ticketId]);   
        return result[0];
    }

    static async GetList(filter) {
        let sql = 'SELECT * FROM tickets WHERE 1=1';

        if (filter.unit && filter.unit.length > 0) {
            const units = filter.unit.map(unit => `'${unit}'`).join(',');
            sql += ` AND ${this.UnitField} IN (${units})`;
            sql += ` AND ${this.UnitField} = '${filter.unit}'`;
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
            sql += ` AND helperCountries IN (${helperCountries})`;
        }
        if (filter.clientCountries && filter.clientCountries.length > 0) {
            const clientCountries = filter.clientCountries.map(country => `'${country}'`).join(',');
            sql += ` AND clientCountries IN (${clientCountries})`;
        }
        if (filter.date) {
            sql += ` AND ${this.DateField} = '${filter.date}'`;
        }
        if (filter.reaction) {
            sql += ` AND ${this.ReactionField} = '${filter.reaction}'`;
        }
        if (filter.status) {
            sql += ` AND ${this.StatusField} = '${filter.status}'`;
        }
  
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

// let sql = `
//             SELECT * FROM ${this.TableName} WHERE 1=1
//             ${filter.date ? ` AND date = '${filter.date}'` : ``}
//             ${filter.unit ? ` AND unit = '${filter.unit}'` : ``}
//             ${filter.theme ? ` AND theme = '${filter.theme}'` : ``}
//             ${filter.status ? ` AND status = '${filter.status}'` : ``}
//             ${filter.subTheme ? ` AND subTheme = '${filter.subTheme}'` : ``}
//             ${filter.reaction ? ` AND reaction = '${filter.reaction}'` : ``}
//             ${filter.helperName ? ` 
//                 AND reaction = '${filter.helperName}'
//                 ` : ``
//             }
//             ` + ` ORDER BY ${filter.orderBy} ${filter.orderDir}
//             ` + ` LIMIT ${filter.limit} OFFSET ${filter.offset}
//         `;