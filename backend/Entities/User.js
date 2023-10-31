class UserEntity{
    static pool;

    static async Get(id) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const rows = await new Promise((resolve, reject) => {
                connection.query('SELECT * from users WHERE id = ?', [id], (err, rows) => {
                    connection.release();
                    err ? reject(err) : resolve(rows);
                });
            });

            return rows;
        } catch (err) {
            //console.error(err);
            return { error: 'DB access error' };
        }
    }

    static async GetHelper(id) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const rows = await new Promise((resolve, reject) => {
                connection.query('SELECT * from helpers WHERE id = ?', [id], (err, rows) => {
                    connection.release();
                    err ? reject(err) : resolve(rows);
                });
            });

            return rows;
        } catch (err) {
            //console.error(err);
            return { error: 'DB access error' };
        }
    }

    static GetAll() {
        const result = pool.query('SELECT * from posts');
        return result[0];
    }

    static Insert(id, name, role, county) {
        pool.query(
            'INSERT INTO posts SET ?',
            { id, name, role, county }
        );
    }

    static Update(id) {

    }

    static Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default UserEntity;