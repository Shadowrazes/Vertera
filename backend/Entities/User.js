import Entity from "./Entity.js";
import Account from "../Utils/Account.js"
import Token from "../Utils/Token.js"
import Errors from "../Utils/Errors.js";
import Client from "./Client.js";
import axios from 'axios';

class User extends Entity {
    static TableName = 'users';
    static PrimaryField = 'id';
    static NameField = 'name';
    static SurnameField = 'surname';
    static PatronymicField = 'patronymic';
    static RoleField = 'role';
    static CountryIdField = 'countryId';
    static LoginField = 'login';
    static PasswordField = 'password';
    static IsActiveField = 'isActive';

    static AdminId = 0;

    static RoleClient = 'client';
    static RoleHelper = 'helper';
    static RoleAdmin = 'system';

    static userAccess = [this.RoleAdmin, this.RoleHelper, this.RoleClient];
    static helperAccess = [this.RoleAdmin, this.RoleHelper];
    static adminAccess = [this.RoleAdmin];

    static async Login(login, password) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.LoginField} = ?`;
        const userResult = await super.Request(sql, [login]);

        if (userResult.length == 0) throw new Error(Errors.IncorrectLogin);

        if (!userResult[0].isActive) throw new Error(Errors.UserDeactivated);

        const passwordHash = userResult[0].password;
        const userId = userResult[0].id;
        const isPassValid = await Account.CheckPassword(password, passwordHash);

        if (!isPassValid) throw new Error(Errors.IncorrectPass);

        const token = await Token.Generate({ userId });

        return { token, user: userResult[0] };
    }

    static async LoginOuter(sessionKey) {
        let response = undefined;

        let headers = {
            'X-App-Token': 'b6f2a80e-1c0f-4298-969b-431592d6f9f9',
            'Content-Type': 'application/json'
        };

        let graphql = {
            query: `mutation userLogin { User { Login(UserLoginByOneTimeTokenInput: {token: \"${sessionKey}\"} ) { isSuccessful accessToken } } }`,
            variables: {}
        };

        try {
            response = await axios.post("https://backend.boss.vertera.org/graphql/partner", graphql, { headers });
            console.log(1);
            console.log(response.data);
            console.log(response.data.data.User.Login.accessToken);
        } catch (error) {
            console.error(error);
        }

        if(response.data.data.User.Login.accessToken == undefined) throw new Error(Errors.IncorrectLogin);

        headers = {
            'X-App-Token': 'b6f2a80e-1c0f-4298-969b-431592d6f9f9',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.data.data.User.Login.accessToken}`
        };

        graphql = JSON.stringify({
            query: "query {\r\n  UserGroup {\r\n    User {\r\n      user {\r\n        ... on User {\r\n          firstName\r\n          lastName\r\n          middleName\r\n          idRef\r\n          emails {\r\n            email\r\n            isMain\r\n            isConfirmed\r\n          }\r\n          phones {\r\n            phone\r\n            isMain\r\n            isConfirmed\r\n          }\r\n          country{code}\r\n          parents {\r\n            referrer {\r\n              ... on UserReferrerForUser {\r\n                idRef\r\n              }\r\n            }\r\n          }\r\n        }\r\n      }\r\n      errors {\r\n        __typename\r\n      }\r\n    }\r\n  }\r\n}",
            variables: {}
        });

        try {
            response = await axios.post('https://backend.boss.vertera.org/graphql/partner', graphql, { headers });
            console.log(response.data);
            console.log(response.data.data.UserGroup.User);
        }
        catch (error) {
            console.error(error);
        }

        const user = response.data.data.UserGroup.User.user;

        let clientFields = {
            outerId: user.idRef,
            email: user.emails[0].email,
            idRef: user.parents.referrer.idRef
        };

        let userFields = {
            name: user.firstName,
            surname: user.lastName,
            patronymic: user.middleName,
            countryId: 1,
            phone: user.phones[0].phone
        };

        console.log(clientFields);
        console.log(userFields);

        let existingClient = await Client.GetByOuterId(clientFields.outerId);
        let userId = -1;

        if (!existingClient) {
            userId = await Client.TransInsert(userFields, clientFields);
        }
        else {
            userId = existingClient.id;
            const existingClientUpd = await Client.TransUpdate(userId, userFields, clientFields);
        }

        const token = await Token.Generate({ userId });
        const curUser = await this.GetById(userId);

        return { token, user: curUser };
    }

    static ValidateRoleAccess(level, userRole) {
        if (level == this.RoleClient) return this.userAccess.includes(userRole);
        else if (level == this.RoleHelper) return this.helperAccess.includes(userRole);
        else if (level == this.RoleAdmin) return this.adminAccess.includes(userRole);
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
        if (user.length == 0) throw new Error(Errors.InvalidToken);
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

        if (fields.password && !fields.login || !fields.password && fields.login) {
            throw new Error(Errors.RegisterNoPassOrLogin);
        }

        if (fields.password) {
            if (fields.password.length < 6) {
                throw new Error(Errors.InvalidRegisterPass);
            }

            fields.password = await Account.GeneratePassHash(fields.password);
        }
        fields.isActive = true;
        const result = await super.TransRequest(conn, sql, [fields]);
        return result.insertId;
    }

    static async TransUpdate(conn, id, fields) {
        if (fields.password) {
            if (fields.password.length < 6) {
                throw new Error(Errors.InvalidRegisterPass);
            }

            fields.password = await Account.GeneratePassHash(fields.password);
        }

        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.TransRequest(conn, sql, [fields, id]);
        return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
    }

    // Cascade deleting User & (Client || Helper) 
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default User;