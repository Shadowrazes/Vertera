import Entity from "./Entity.js";

class TicketEntity extends Entity{
    static TableName = 'tickets';

    static async Get(id) {
        return await super.Get(id, this.TableName);
    }

    static async GetList(filter) {
        // unit: String
        // theme: String
        // subTheme: String
        // helperName: String
        // helperCountries: [String]
        // clientCountries: [String]
        // date: String
        // reaction: String
        // status: String
        // orderBy: String!
        // orderDir: String!
        // limit: Int!
        // offset: Int!

        let sql = 'SELECT * FROM tickets WHERE 1=1';

        if (filter.unit && filter.unit.length > 0) {
            const units = filter.unit.map(unit => `'${unit}'`).join(',');
            sql += ` AND unit IN (${units})`;
            sql += ` AND unit = '${filter.unit}'`;
        }
        if (filter.theme && filter.theme.length > 0) {
            const themes = filter.theme.map(theme => `'${theme}'`).join(',');
            sql += ` AND theme IN (${themes})`;
        }
        if (filter.subTheme && filter.subTheme.length > 0) {
            const subThemes = filter.subTheme.map(subTheme => `'${subTheme}'`).join(',');
            sql += ` AND subTheme IN (${subThemes})`;
        }
        if (filter.helperName && filter.helperName.length > 0) {
            const helperNames = filter.helperName.map(helperName => `'${helperName}'`).join(',');
            sql += ` AND helperName IN (${helperNames})`;
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
            sql += ` AND date = '${filter.date}'`;
        }
        if (filter.reaction) {
            sql += ` AND reaction = '${filter.reaction}'`;
        }
        if (filter.status) {
            sql += ` AND status = '${filter.status}'`;
        }
  
        sql += ` ORDER BY ${filter.orderBy} ${filter.orderDir}`;
        sql += ` LIMIT ${filter.limit} OFFSET ${filter.offset}`;

        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const rows = await new Promise((resolve, reject) => {
                connection.query(sql, (err, rows) => {
                    connection.release();
                    err ? reject(err) : resolve(rows);
                });
            });

            console.log(rows);
            return rows;
        } catch (err) {
            console.error(err);
            return { error: 'DB access error' };
        }
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