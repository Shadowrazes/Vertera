import Entity from "./Entity.js";
import User from "./User.js";

class Client extends Entity {
    static TableName = 'clients';
    static PrimaryField = 'id';
    static PhoneField = 'phone';
    static EmailField = 'email';
    static OuterIdField = 'outerId';
    static IdRefField = 'idRef';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetByOuterId(outerId) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.OuterIdField} = ?`;
        const result = await super.Request(sql, [outerId]);
        return result[0];
    }

    static async GetByEmail(email) {
        let sql = `
        SELECT  * FROM ${this.TableName} 

        JOIN    ${User.TableName} 
                ON ${this.TableName}.${this.PrimaryField} = ${User.TableName}.${User.PrimaryField}

        WHERE   1=1 AND ${this.EmailField} = ?
        `;

        const result = await super.Request(sql, [email]);
        return result;
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(userFields, clientFields) {
        return await super.Transaction(async (conn) => {
            userFields.role = User.RoleClient;
            const id = await User.TransInsert(conn, userFields);
            clientFields.id = id;
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const result = await super.TransRequest(conn, sql, [clientFields]);
            return id;
        });
    }

    static async TransUpdate(id, userFields, clientFields) {
        return await super.Transaction(async (conn) => {
            let clientResult = super.EmptyUpdateInfo;

            if (!super.IsArgsEmpty(clientFields)) {
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                clientResult = await super.TransRequest(conn, sql, [clientFields, id]);
            }

            if (!super.IsArgsEmpty(userFields)) {
                const userResult = await User.TransUpdate(conn, id, userFields);
            }

            return {
                affected: clientResult.affectedRows, changed: clientResult.changedRows,
                warning: clientResult.warningStatus
            };
        });
    }
}

export default Client;