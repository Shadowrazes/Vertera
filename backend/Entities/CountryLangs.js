import Entity from "./Entity.js";
import Country from "./Country.js";
import Langs from "./Langs.js";

class CountryLangs extends Entity {
    static TableName = 'countries_langs';
    static PrimaryFieldCountry = 'countryId';
    static PrimaryFieldLang = 'langId';

    static async GetById(countryId, langId) {
        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.PrimaryFieldCountry} = ? AND ${this.PrimaryFieldLang} = ?
        `;
        const result = await super.Request(sql, [countryId, langId]);
        return result[0];
    }

    static async GetListByCountryId(countryId) {
        const sql = `
        SELECT * FROM ${Langs.TableName} 
        WHERE ${Langs.PrimaryField} IN (
            SELECT ${this.PrimaryFieldLang} FROM ${this.TableName} 
            WHERE ${this.PrimaryFieldCountry} = ?
        )`;

        const result = await super.Request(sql, [countryId]);
        return result;
    }

    static async TransInsert(conn, countryId, langIds) {
        if(langIds.length < 1) throw new Error(Errors.EmptyArgsFields);

        let insertedIds = [];
        for (const langId of langIds) {
            const sql = `INSERT IGNORE INTO ${this.TableName} SET ?`;
            const fields = { countryId, langId };
            const result = await super.TransRequest(conn, sql, [fields]);

            if(result.insertId){
                insertedIds.push(result.insertId);
            }
        }
        return insertedIds;
    }

    static async TransDeleteByCountry(conn, id, langIds) {
        const sql = `
            DELETE FROM ${this.TableName} 
            WHERE ${this.PrimaryFieldCountry} = ? AND ${this.PrimaryFieldLang} NOT IN (?);
        `;
        const result = await super.TransRequest(conn, sql, [id, langIds]);
        return result.affectedRows;
    }
}

export default CountryLangs;