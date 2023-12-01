import Entity from "./Entity.js";
import Translation from "./Translation.js";

class HelperJobTitle extends Entity{
    static TableName = 'helper_job_titles';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static TranslationType = 'jobTitle'

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
            const codeType = this.TranslationType;
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType, codeType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = {nameCode};
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            const row = await this.GetById(id);
            const codeType = this.TranslationType;
            const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode, codeType);
            return translationResult;
        });
    }
}

export default HelperJobTitle;