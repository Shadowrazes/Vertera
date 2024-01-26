import Entity from "./Entity.js";
import Department from "./Department.js";

class HelperDepartment extends Entity {
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
        SELECT * from ${Department.TableName} 
        WHERE ${Department.PrimaryField} IN (
            SELECT ${this.DepartmentIdField} from ${this.TableName} 
            WHERE ${this.HelperIdField} = ?
        )`;

        const result = await super.Request(sql, [helperId]);
        return result;
    }

    static async TransInsert(conn, helperId, departmentIds) {
        let insertedIds = [];
        for (const departmentId of departmentIds) {
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = { helperId, departmentId };
            const result = await super.TransRequest(conn, sql, [fields]);
            insertedIds.push(result.insertId);
        }
        return insertedIds;
    }

    static async TransDeleteByHelper(conn, id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.HelperIdField} = ?`;
        const result = await super.TransRequest(conn, sql, [id]);
        return result.affectedRows;
    }
}

export default HelperDepartment;