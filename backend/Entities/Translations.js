import Entity from "./Entity.js";

class Translations extends Entity{
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
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const result = await super.Request(sql, [fields]);
        return result.insertId;
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }
}

export default Translations;