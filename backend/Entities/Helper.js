import Entity from "./Entity.js";
import UserEntity from "./User.js";

class HelperEntity extends Entity{
    static TableName = 'helpers';

    static async Get(id) {
        return await super.Get(id, this.TableName);
    }

    static async GetAll() {
        
    }

    static async Insert(fullName, country, login, password) {
        const id = await UserEntity.Insert(fullName, 'helper', country);

        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const result = await new Promise((resolve, reject) => {
                connection.query(`INSERT INTO ${this.TableName} SET ?`, {id, login, password}, (err, result) => {
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

export default HelperEntity;