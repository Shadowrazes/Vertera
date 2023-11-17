import Entity from "./Entity.js";

class DepartmentEntity extends Entity{
    static TableName = 'departments';
    static PrimaryField = 'id';
    static NameField = 'name';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * from ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }
}

export default DepartmentEntity;