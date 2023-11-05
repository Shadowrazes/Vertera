import Entity from "./Entity.js";
import UserEntity from "./User.js";

class HelperEntity extends Entity{
    static TableName = 'helpers';
    static PrimaryField = 'id';
    static LoginField = 'login';
    static PasswordField = 'password';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetAll() {
        
    }

    static async Insert(fullName, country, login, password) {
        const id = await UserEntity.Insert(fullName, 'helper', country);
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const fields = {id, login, password};
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

export default HelperEntity;