import Entity from "./Entity.js";

class UserEntity extends Entity{
    static TableName = 'users';

    static async Get(id) {
        return await super.Get(id, this.TableName);
    }

    static async GetAll() {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const rows = await new Promise((resolve, reject) => {
                connection.query(`SELECT * from ${this.TableName}`, (err, rows) => {
                    connection.release();
                    err ? reject(err) : resolve(rows);
                });
            });

            return rows;
        } catch (err) {
            console.error(err);
            return { error: 'DB access error' };
        }
    }

    static async Insert(fullName, role, country) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const insertId = await new Promise((resolve, reject) => {
                connection.query(`INSERT INTO ${this.TableName} SET ?`, {fullName, role, country}, (err, result) => {
                    connection.release();
                    err ? reject(err) : resolve(result.insertId);
                });
            });

            console.log(insertId);
            return insertId;
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

export default UserEntity;