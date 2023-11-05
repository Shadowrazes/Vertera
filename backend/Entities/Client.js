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

    static async Insert(args) {
        const id = await UserEntity.Insert(args, 'client');
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const fields = {id, phone: args.phone, email: args.email};
        const result = await super.Request(sql, fields);
        return id;
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default ClientEntity;