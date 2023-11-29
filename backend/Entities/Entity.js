class Entity{
    static Pool;

    static async GetConn() {
        return await this.Pool.getConnection().catch(err => {
            console.log(err);
            throw err.code ? new Error('Unsolvable') : err;
        });
    }

    static async Request(sql, fields) {
        const conn = await this.GetConn();

        return conn.query(sql, fields).then(res => {
            console.log('Request Completed');
            return res[0];
        })
        .catch(err =>{
            console.log(err);
            throw err.code ? new Error('Unsolvable') : err;
        })
        .finally(() => {
            conn.release();
            console.log('Conn Released');
        });
    }

    static async TransRequest(conn, sql, fields) {
        return await conn.query(sql, fields).then(res => {
            console.log('Trans Request Completed');
            return res[0];
        });
    }

    static async Transaction(reqQueue) {
        const conn = await this.Pool.getConnection().catch(err => {
            console.log(err);
            throw err.code ? new Error('Unsolvable') : err;
        });

        try{
            await conn.beginTransaction();
            const result = await reqQueue(conn);
            await conn.commit();
            console.log('Conn Commit');
            return result;
        }
        catch(err){
            await conn.rollback();
            console.log(err);
            console.log('Conn Rollback');
            throw err.code ? new Error('Unsolvable') : err;
        }
        finally {
            conn.release();
            console.log('Conn Released');
        }
    }
}

export default Entity;