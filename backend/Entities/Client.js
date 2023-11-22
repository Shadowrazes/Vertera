import Entity from "./Entity.js";
import UserEntity from "./User.js";

class ClientEntity extends Entity{
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
            const id = await UserEntity.TransInsert(conn, userFields);
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, email: clientFields.email};
            const result = await super.TransRequest(conn, sql, [fields]);
            return id;
        });
    }
    
    static async TransUpdate(id, userFields, clientFields) {
        return await super.Transaction(async (conn) => {
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            
            const clientResult = await super.TransRequest(conn, sql, [clientFields, id]);
            const userResult = await UserEntity.TransUpdate(conn, id, userFields);

            return {affected: clientResult.affectedRows, changed: clientResult.changedRows, 
                    warning: clientResult.warningStatus};
        });
    }
}

export default ClientEntity;