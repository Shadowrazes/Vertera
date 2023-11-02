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

    static async Insert(id, name, role, county) {
        Pool.query(
            'INSERT INTO posts SET ?',
            { id, name, role, county }
        );
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default UserEntity;