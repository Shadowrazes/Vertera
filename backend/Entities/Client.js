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

    static async TransInsert(args) {
        return await super.Transaction(async (conn) => {
            const id = await UserEntity.TransInsert(conn, args, 'client');
            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, email: args.email};
            const result = await super.TransRequest(conn, sql, [fields]);
            return id;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            const userFields = { fullName: fields.fullName, country: fields.country, phone: fields.phone };
            const clientFields = { email: fields.email };
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            
            const clientResult = await super.TransRequest(conn, sql, [clientFields, id]);
            const userResult = await UserEntity.TransUpdate(conn, id, userFields);

            return {affected: clientResult.affectedRows, changed: clientResult.changedRows, 
                    warning: clientResult.warningStatus};
        });
    }
}

export default ClientEntity;