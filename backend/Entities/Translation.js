import Entity from "./Entity.js";
import Translitter from "../Utils/Translitter.js";
import Errors from "../Utils/Errors.js";
import md5 from 'md5';
import axios from 'axios';

class Translation extends Entity {
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

    static async GetAutoTranslation(stroke, lang) {
        const apiKey = "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";
        const model = "gpt-3.5-turbo";

        const prompt = `Переведи этот текст на ${lang} язык: "${stroke}"`;

        const requestData = {
            model,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
        };

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        };

        axios.post("https://api.openai.com/v1/chat/completions", requestData, {
            headers,
        }).then((response) => {
            const generatedText = response.data.choices[0].message.content;
            console.log(1);
            console.log(generatedText);
        }).catch((error) => {
            console.error("Ошибка при запросе к OpenAI API:", error.message);
        });
    }

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

    static async GetListFull() {
        const sql = `
            SELECT * FROM ${this.TableName}
        `;
        const result = await super.Request(sql);
        return result;
    }

    static async Insert(fields) {
        // одинаковые переводы элементов интерфейса в разных частях сайта?
        if (!this.OuterTypes.includes(fields.type)) throw new Error(Errors.ForbiddenTranslationType);

        const code = Translitter.Transform(fields.type + ' ' + md5(new Date().toISOString()));
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${fields.type}'
        `;

        const result = await super.Request(sql, [fields.stroke]);
        return code;
    }

    // Types come from other entities, only internal
    static async TransInsert(conn, fields, type) {
        if (fields.lang != this.MainLang) throw new Error(Errors.TranslationInsertLangNoRu);

        const code = Translitter.Transform(type + ' ' + md5(new Date().toISOString()));
        const sql = `
            INSERT INTO ${this.TableName} 
            SET ${fields.lang} = ?, ${this.CodeField} = '${code}', ${this.TypeField} = '${type}'
        `;

        const result = await super.TransRequest(conn, sql, [fields.stroke]);
        return code;
    }

    // Cascade updating translation & dependent tables
    static async Update(fields) {
        const sql = `
            UPDATE ${this.TableName} 
            SET ${fields.lang} = ?
            WHERE ${this.CodeField} = ?
        `;

        const result = await super.Request(sql, [fields.stroke, fields.code]);

        return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
    }

    // Code come from other entities, only internal
    // Cascade updating translation & dependent tables by other entities
    static async TransUpdate(conn, fields, code) {
        if (fields.lang != this.MainLang) throw new Error(Errors.TranslationRenamingLangNoRu);

        const sql = `
            UPDATE ${this.TableName} 
            SET ${fields.lang} = ?
            WHERE ${this.CodeField} = ?
        `;

        const result = await super.TransRequest(conn, sql, [fields.stroke, code]);

        return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
    }

    static async Delete(code) {

    }
}

export default Translation;