import Entity from "./Entity.js";
import Translation from "./Translation.js";

class SubTheme extends Entity{
    static TableName = 'subthemes';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static ThemeIdField = 'themeId';
    static TranslationType = 'subTheme'

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

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if(fields.stroke){
                const row = await this.GetById(id);
                const codeType = this.TranslationType + ' ' + row.id;
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode, codeType);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if(fields.themeId) updateFields.themeId = fields.themeId;
            else return super.EmptyUpdateInfo;

            const result = await super.TransRequest(conn, sql, [updateFields, id]);
            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    // Cascade deleting SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default SubTheme;