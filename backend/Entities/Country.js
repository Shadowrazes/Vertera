import Entity from "./Entity.js";
import Translation from "./Translation.js";
import CountryLangs from "./CountryLangs.js";

class Country extends Entity {
    static TableName = 'countries';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static CodeField = 'code';
    static TranslationType = 'country'

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

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = { nameCode, code: fields.code };
            const result = await super.TransRequest(conn, sql, [insertFields]);

            const langResult = await CountryLangs.TransInsert(conn, result.insertId, fields.langIds);

            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if (super.ArgsSize(fields) < 2) throw new Error(Errors.EmptyArgsFields);

            let result = undefined;

            const curCountry = await this.GetById(id);

            if(fields.langIds){
                const delResult = await CountryLangs.TransDeleteByCountry(conn, id, fields.langIds);
                result = await CountryLangs.TransInsert(conn, id, fields.langIds);
            }

            if(fields.stroke){
                result = await Translation.TransUpdate(conn, fields, curCountry.nameCode);
            }

            const updateFields = {};
            if (fields.code) updateFields.code = fields.code;
            if (!super.IsArgsEmpty(updateFields)) {
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                result = await super.TransRequest(conn, sql, [updateFields, id]);
            }

            return result;
        });
    }

    static async DeleteCascade(id) {
        return await super.Transaction(async (conn) => {
            const curCountry = await this.GetById(id);
            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.TransDelete(conn, curCountry.nameCode);

            return result.affectedRows;
        });
    }
}

export default Country;