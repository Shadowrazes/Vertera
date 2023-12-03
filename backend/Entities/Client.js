import Entity from "./Entity.js";
import User from "./User.js";

class Client extends Entity{
    static TableName = 'clients';
    static PrimaryField = 'id';
    static PhoneField = 'phone';
    static EmailField = 'email';

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

    static async TransInsert(userFields, clientFields) {
        return await super.Transaction(async (conn) => {
            userFields.role = 'client';
            const id = await User.TransInsert(conn, userFields);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, email: clientFields.email};
            const result = await super.TransRequest(conn, sql, [fields]);
            return id;
        });
    }
    
    static async TransUpdate(id, userFields, clientFields) {
        return await super.Transaction(async (conn) => {
            let clientResult = super.EmptyUpdateInfo;

            if(!super.IsArgsEmpty(clientFields)){
                const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
                clientResult = await super.TransRequest(conn, sql, [clientFields, id]);
            }

            if(!super.IsArgsEmpty(userFields)){
                const userResult = await User.TransUpdate(conn, id, userFields);
            }

            return {affected: clientResult.affectedRows, changed: clientResult.changedRows, 
                    warning: clientResult.warningStatus};
        });
    }
}

export default Client;