import Entity from "./Entity.js";
import Account from "../Utils/Account.js"

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

    static async TransInsert(conn, fields) {
        const sql = `INSERT INTO ${this.TableName} SET ?`;

        if(fields.password && !fields.login || !fields.password && fields.login){
            throw new Error('No password or login');
        }

        if(fields.password){
            if(fields.password.length < 6){
                throw new Error('Bad password');
            }

            fields.password = await Account.GenerateHash(fields.password);
        }
        const result = await super.TransRequest(conn, sql, [fields]);
        return result.insertId;
    }

    static async TransUpdate(conn, id, fields) {
        if(fields.password){
            if(fields.password.length < 6){
                throw new Error('Bad password');
            }

            fields.password = await Account.GenerateHash(fields.password);
        }

        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.TransRequest(conn, sql, [fields, id]);
        return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
    }

    // Cascade deleting User & (Client || Helper) 
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default UserEntity;