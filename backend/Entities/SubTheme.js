import Entity from "./Entity.js";
import Translation from "./Translation.js";
import ThemeDepartment from "./ThemeDepartment.js";

class SubTheme extends Entity{
    static TableName = 'subthemes';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static ThemeIdField = 'themeId';
    static OrderField = 'orderNum';
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

    static async GetListByTheme(themeId) {
        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.ThemeIdField} = ?
            ORDER BY ${this.OrderField} ASC
        `;
        const result = await super.Request(sql, [themeId]);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = {themeId: fields.themeId, nameCode};
            const result = await super.TransRequest(conn, sql, [insertFields]);

            const themeDepartmentResult = await ThemeDepartment.TransInsert(conn, result.insertId, fields.departmentIds);

            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if(fields.stroke){
                const row = await this.GetById(id);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            if(fields.departmentIds && fields.departmentIds.length > 0) {
                const themeDepartmentDelResult = await ThemeDepartment.TransDeleteBySubTheme(conn, id);
                const themeDepartmentInsertResult = await ThemeDepartment.TransInsert(conn, id, fields.departmentIds);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if(fields.themeId) updateFields.themeId = fields.themeId;
            if(fields.orderNum) updateFields.orderNum = fields.orderNum;
            if(super.IsArgsEmpty(updateFields)) return super.EmptyUpdateInfo;

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