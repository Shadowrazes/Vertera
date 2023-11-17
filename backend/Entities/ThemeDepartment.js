import Entity from "./Entity.js";
import DepartmentEntity from "./Department.js"; 

class ThemeDepartmentEntity extends Entity{
    static TableName = 'theme_departments';
    static PrimaryField = 'id';
    static SubThemeIdField = 'subThemeId';
    static DepartmentIdField = 'departmentId';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetListBySubThemeId(subThemeId) {
        const sql = `
        SELECT * from ${DepartmentEntity.TableName} 
        WHERE ${DepartmentEntity.PrimaryField} IN (
            SELECT ${this.DepartmentIdField} from ${this.TableName} 
            WHERE ${this.SubThemeIdField} = ?
        )`;

        const result = await super.Request(sql, [subThemeId]);
        return result;
    }
}

export default ThemeDepartmentEntity;