import Entity from "./Entity.js";
import Translation from "./Translation.js";

class Langs extends Entity {
    static TableName = 'langs';
    static PrimaryField = 'id';
    static NameField = 'name';
    static CodeField = 'code';
    static IsActiveField = 'isActive';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.IsActiveField} <> 0`;
        const result = await super.Request(sql);
        return result;
    }

    static async GetIsActiveCodeList() {
        const sql = `SELECT ${this.CodeField} FROM ${this.TableName} WHERE ${this.IsActiveField} <> 0`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const result = await super.TransRequest(conn, sql, [fields]);

            const translationResult = await Translation.AddLang(conn, fields.code);

            return result.insertId;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if (super.IsArgsEmpty(fields)) throw new Error(Errors.EmptyArgsFields);

            const curLang = await this.GetById(id);

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [fields, id]);

            if(fields.code) {
                const translationResult = await Translation.RenameLang(conn, curLang.code, fields.code);
            }

            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    static async TransDelete(id) {
        return await super.Transaction(async (conn) => {
            const curLang = await this.GetById(id);

            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.DropLang(conn, curLang.code);

            return result.affectedRows;
        });
    }
}

export default Langs;