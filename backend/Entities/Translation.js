import Entity from "./Entity.js";
import Translitter from "../Utils/Translitter.js";

class Translation extends Entity{
    static TableName = 'translations';
    static PrimaryField = 'id';
    static TypeField = 'type';
    static CodeField = 'code';
    static LangAS = 'stroke';

    static async GetByCode(lang, code) {
        const sql = `
            SELECT ${this.TypeField}, ${this.CodeField}, ${lang} AS ${this.LangAS} 
            FROM ${this.TableName} WHERE ${this.CodeField} = ?
        `;
        const result = await super.Request(sql, [code]);
        return result[0];
    }

    static async GetList(lang) {
        const sql = `
            SELECT ${this.TypeField}, ${this.CodeField}, ${lang} AS ${this.LangAS} 
            FROM ${this.TableName}
        `;
        const result = await super.Request(sql);
        return result;
    }

    static async GetListByType(lang, type) {
        const sql = `
            SELECT ${this.TypeField}, ${this.CodeField}, ${lang} AS ${this.LangAS} 
            FROM ${this.TableName} WHERE ${this.TypeField} = ?
        `;
        const result = await super.Request(sql, [type]);
        return result;
    }

    static async Insert(fields) {
        const code = Translitter.Transform(fields.type + ' ' + fields.stroke);
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${fields.type}'
        `;

        const result = await super.Request(sql, [fields.stroke]);
        return code;
    }

    static async TransInsert(conn, fields, type) {
        const code = Translitter.Transform(type + ' ' + fields.stroke);
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${type}'
        `;

        const result = await super.TransRequest(conn, sql, [fields.stroke]);
        return code;
    }

    // Cascade updating translation & dependent tables
    static async Update(fields) {
        const codeType = fields.code.split('_')[0];
        const newCode = Translitter.Transform(codeType + ' ' + fields.stroke);

        const sql = `
            UPDATE ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${newCode}'
            WHERE ${this.CodeField} = ?
        `;
   
        const result = await super.Request(sql, [fields.stroke, fields.code]);

        return {affected: result.affectedRows, changed: result.changedRows, 
                warning: result.warningStatus};
    }

    static async Delete(code) {

    }
}

export default Translation;