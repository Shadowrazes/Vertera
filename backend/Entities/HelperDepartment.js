import Entity from "./Entity.js";
import DepartmentEntity from "./Department.js"; 

class HelperDepartmentEntity extends Entity{
    static TableName = 'helper_departments';
    static PrimaryField = 'id';
    static HelperIdField = 'helperId';
    static DepartmentIdField = 'departmentId';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetListByHelperId(helperId) {
        const sql = `
        SELECT * from ${DepartmentEntity.TableName} 
        WHERE ${DepartmentEntity.PrimaryField} IN (
            SELECT ${this.DepartmentIdField} from ${this.TableName} 
            WHERE ${this.HelperIdField} = ?
        )`;

        const result = await super.Request(sql, [helperId]);
        return result;
    }
}

export default HelperDepartmentEntity;