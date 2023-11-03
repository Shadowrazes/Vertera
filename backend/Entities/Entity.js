class Entity{
    static Pool;

    static async Request(sql, fields) {
        try {
            const connection = await new Promise((resolve, reject) => {
                this.Pool.getConnection((err, connection) => {
                    err ? reject(err) : resolve(connection);
                });
            });

            const result = await new Promise((resolve, reject) => {
                connection.query(sql, fields, (err, result) => {
                    connection.release();
                    err ? reject(err) : resolve(result);
                });
            });

            return result;
        } catch (err) {
            console.log(err);
            const e = new Error(`Error code ${err.code}`);
            throw e;
            return { error: 'DB access error' };
        }
    }

    static async Insert(id, name, role, county) {
        
    }
}

export default Entity;