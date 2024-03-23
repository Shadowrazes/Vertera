import Entity from "./Entity.js";
import User from "./User.js";
import Errors from "../Utils/Errors.js";

class HelperPermission extends Entity {
    static TableName = 'helper_permissions';
    static PrimaryField = 'helperId';
    static SendMsgField = 'sendMsg';
    static HelperEditField = 'helperEdit';
    static ThemeEditField = 'themeEdit';
    static TranslationEditField = 'translationEdit';

    static async Validate(helperId, permName) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [helperId]);
        const perms = result[0];
        console.log(perms);

        if(!perms[permName]) throw new Error(Errors.AccessForbidden);

        return perms[permName];
    }

    static async GetById(helperId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [helperId]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} <> 0`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(conn, helperId) {
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const result = await super.TransRequest(conn, sql, [helperId]);
        return helperId;
    }

    static async TransUpdate(conn, helperId, permissions) {
        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.TransRequest(conn, sql, [permissions, helperId]);

        return {
            affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus
        };
    }
}

export default HelperPermission;