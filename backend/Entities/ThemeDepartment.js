import Entity from "./Entity.js";
import Department from "./Department.js";

class ThemeDepartment extends Entity {
    static TableName = 'theme_departments';
    static PrimaryField = 'id';
    static SubThemeIdField = 'subThemeId';
    static DepartmentIdField = 'departmentId';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetListBySubThemeId(subThemeId) {
        const sql = `
        SELECT * FROM ${Department.TableName} 
        WHERE ${Department.PrimaryField} IN (
            SELECT ${this.DepartmentIdField} FROM ${this.TableName} 
            WHERE ${this.SubThemeIdField} = ?
        )`;

        const result = await super.Request(sql, [subThemeId]);
        return result;
    }

    static async TransInsert(conn, subThemeId, departmentIds) {
        let insertedIds = [];
        for (const departmentId of departmentIds) {
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = { subThemeId, departmentId };
            const result = await super.TransRequest(conn, sql, [fields]);
            insertedIds.push(result.insertId);
        }
        return insertedIds;
    }

    static async TransDeleteBySubTheme(conn, id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.SubThemeIdField} = ?`;
        const result = await super.TransRequest(conn, sql, [id]);
        return result.affectedRows;
    }
}

export default ThemeDepartment;