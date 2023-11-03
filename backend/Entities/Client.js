import Entity from "./Entity.js";
import UserEntity from "./User.js";

class ClientEntity extends Entity{
    static TableName = 'clients';

    static async Get(id) {
        
    }

    static async GetAll() {
        
    }

    static async Insert(fullName, country, phone, email) {
        const id = await UserEntity.Insert(fullName, 'client', country);

        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const result = await new Promise((resolve, reject) => {
                connection.query(`INSERT INTO ${this.TableName} SET ?`, {id, phone, email}, (err, result) => {
                    connection.release();
                    err ? reject(err) : resolve(result);
                });
            });

            return id;
        } catch (err) {
            console.error(err);
            return { error: 'DB access error' };
        }
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default ClientEntity;