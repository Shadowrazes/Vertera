class Entity{
    static Pool;

    static async Get(id, table) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const rows = await new Promise((resolve, reject) => {
                connection.query(`SELECT * from ${table} WHERE id = ?`, [id], (err, rows) => {
                    connection.release();
                    err ? reject(err) : resolve(rows);
                });
            });

            return rows[0];
        } catch (err) {
            console.error(err);
            return { error: 'DB access error' };
        }
    }

    static async GetAll() {
        
    }

    static async Insert(id, name, role, county) {
        
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }
}

export default Entity;