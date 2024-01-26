import Entity from "./Entity.js";
import Account from "../Utils/Account.js"
import Token from "../Utils/Token.js"
import Errors from "../Utils/Errors.js";

class User extends Entity{
    static TableName = 'users';
    static PrimaryField = 'id';
    static NameField = 'name';
    static SurnameField = 'surname';
    static PatronymicField = 'patronymic';
    static RoleField = 'role';
    static CountryIdField = 'countryId';
    static LoginField = 'login';
    static PasswordField = 'password';
    static TokenField = 'token';
    static IsActiveField = 'isActive';

    static RoleClient = 'client';
    static RoleHelper = 'helper';
    static RoleAdmin = 'system';

    static userAccess = [this.RoleAdmin, this.RoleHelper, this.RoleClient];
    static helperAccess = [this.RoleAdmin, this.RoleHelper];
    static adminAccess = [this.RoleAdmin];

    static async Login(login, password) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.LoginField} = ?`;
        const userResult = await super.Request(sql, [login]);

        if(userResult.length == 0) throw new Error(Errors.IncorrectLogin);
        
        if(!userResult[0].isActive) throw new Error(Errors.UserDeactivated);

        const passwordHash = userResult[0].password;
        const userId = userResult[0].id;
        const isPassValid = await Account.CheckPassword(password, passwordHash);

        if(!isPassValid) throw new Error(Errors.IncorrectPass);

        const token = await Token.Generate({ userId });
        const tokenUpdateResult = await this.UpdateToken(userId, { token });

        return { token, userId };
    }

    static ValidateRoleAccess(level, userRole) {
        if(level == this.RoleClient) return this.userAccess.includes(userRole);
        else if(level == this.RoleHelper) return this.helperAccess.includes(userRole);
        else if(level == this.RoleAdmin) return this.adminAccess.includes(userRole);
        return false;
    }

    static async AccessAllow(level, token) {
        const user = await this.GetByToken(token);
        const isAllowed = this.ValidateRoleAccess(level, user.role);
        return { user, isAllowed };
    }

    static async GetByToken(token) {
        const userId = await Token.Validation(token);
        const user = await this.GetById(userId);
        if(user.length == 0) throw new Error(Errors.InvalidToken);
        return user;
    }

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetList() {
        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.PrimaryField} <> 0 AND ${this.IsActiveField} <> 0
        `;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(conn, fields) {
        const sql = `INSERT INTO ${this.TableName} SET ?`;

        if(fields.password && !fields.login || !fields.password && fields.login){
            throw new Error(Errors.RegisterNoPassOrLogin);
        }

        if(fields.password){
            if(fields.password.length < 6){
                throw new Error(Errors.InvalidRegisterPass);
            }

            fields.password = await Account.GeneratePassHash(fields.password);
        }
        fields.isActive = true;
        const result = await super.TransRequest(conn, sql, [fields]);
        return result.insertId;
    }

    static async TransUpdate(conn, id, fields) {
        if(fields.password){
            if(fields.password.length < 6){
                throw new Error(Errors.InvalidRegisterPass);
            }

            fields.password = await Account.GeneratePassHash(fields.password);
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