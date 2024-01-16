import Entity from "./Entity.js";
import Account from "../Utils/Account.js"
import Token from "../Utils/Token.js"

class User extends Entity{
    static TableName = 'users';
    static PrimaryField = 'id';
    static FullNameField = 'fullName';
    static RoleField = 'role';
    static CountryIdField = 'countryId';
    static LoginField = 'login';
    static PasswordField = 'password';
    static TokenField = 'token';

    static userAccess = ['system', 'helper', 'client'];
    static helperAccess = ['system', 'helper'];
    static adminAccess = ['system'];

    static async Login(login, password) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.LoginField} = ?`;
        const userResult = await super.Request(sql, [login]);

        if(userResult.length == 0) throw new Error('Auth error');

        const passwordHash = userResult[0].password;
        const userId = userResult[0].id;
        const isPassValid = await Account.CheckPassword(password, passwordHash);

        if(!isPassValid) throw new Error('Auth error');

        const token = await Token.Generate({ userId });
        const tokenUpdateResult = await this.UpdateToken(userId, { token });

        return { token, userId };
    }

    static async AccessAllow(level, token) {
        const userRole = await this.GetRoleByToken(token);

        if(level == 'user') return this.userAccess.includes(userRole);
        if(level == 'helper') return this.helperAccess.includes(userRole);
        if(level == 'admin') return this.adminAccess.includes(userRole);
    }

    static async GetRoleByToken(token) {
        const userId = await Token.Validation(token);
        const result = await this.GetById(userId);
        if(result.length == 0) throw new Error('Invalid token');
        return result.role;
    }

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

    static async TransInsert(conn, fields) {
        const sql = `INSERT INTO ${this.TableName} SET ?`;

        if(!fields.login || !fields.password){
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

    static async UpdateToken(id, token) {
        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [token, id]);
        return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
    }

    // Cascade deleting User & (Client || Helper) 
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default User;