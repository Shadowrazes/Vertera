import Entity from "./Entity.js";
import Translitter from "../Utils/Translitter.js";
import md5 from 'md5';

class Translation extends Entity{
    static TableName = 'translations';
    static PrimaryField = 'id';
    static TypeField = 'type';
    static CodeField = 'code';
    static LangAS = 'stroke';
    static MainLang = 'ru';
    static OuterTypes = ['interface'];
    static InnerTypes = [
        'ticketStatus', 'subTheme', 'theme', 'unit', 'department', 'jobTitle', 'country'
    ];

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
        // одинаковые переводы элементов интерфейса в разных частях?
        if(!this.OuterTypes.includes(fields.type)){
            throw new Error('This type for translation is forbidden');
        }

        const code = Translitter.Transform(fields.type + ' ' + md5(fields.stroke));
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${fields.type}'
        `;

        const result = await super.Request(sql, [fields.stroke]);
        return code;
    }

    // Types come from other entities, only internal
    static async TransInsert(conn, fields, type, codeType) {
        if(fields.lang != this.MainLang) throw new Error('Insert is possible only by ru lang');

        const code = Translitter.Transform(codeType + ' ' + md5(fields.stroke));
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${type}'
        `;

        const result = await super.TransRequest(conn, sql, [fields.stroke]);
        return code;
    }

    // Cascade updating translation & dependent tables
    static async Update(fields) {
        const codeSplit = fields.code.split('_');
        const codeType = codeSplit[0];

        if(codeSplit.length > 2){
            codeType += ' ' + codeSplit[1];
        }

        const newCode = Translitter.Transform(codeType + ' ' + md5(fields.stroke));

        const sql = `
            UPDATE ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${newCode}'
            WHERE ${this.CodeField} = ?
        `;
   
        const result = await super.Request(sql, [fields.stroke, fields.code]);

        return {affected: result.affectedRows, changed: result.changedRows,
                warning: result.warningStatus, newCode};
    }

    // CodeType come from other entities, only internal
    static async TransUpdate(conn, fields, code, codeType) {
        if(fields.lang != this.MainLang) throw new Error('Renaming is possible only by ru lang');

        const newCode = Translitter.Transform(codeType + ' ' + md5(fields.stroke));

        const sql = `
            UPDATE ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${newCode}'
            WHERE ${this.CodeField} = ?
        `;
   
        const result = await super.TransRequest(conn, sql, [fields.stroke, code]);

        return {affected: result.affectedRows, changed: result.changedRows,
                warning: result.warningStatus, newCode};
    }

    static async Delete(code) {

    }
}

export default Translation;