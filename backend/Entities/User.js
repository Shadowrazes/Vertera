import Entity from "./Entity.js";

class UserEntity extends Entity{
    static TableName = 'users';
    static PrimaryField = 'id';
    static FullNameField = 'fullName';
    static RoleField = 'role';
    static CountryField = 'country';

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

    static async TransInsert(conn, args, role) {
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const fields = {fullName: args.fullName, role, country: args.country, phone: args.phone};
        const result = await super.TransRequest(conn, sql, [fields]);
        return result.insertId;
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default UserEntity;