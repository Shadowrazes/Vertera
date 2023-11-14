class Entity{
    static Pool;

    static async GetConn() {
        return await this.Pool.getConnection().catch(err => {
            console.log(err);
            throw err;
        });
    }

    static async Request(sql, fields) {
        const conn = await this.Pool.getConnection().catch(err => {
            console.log(err);
            throw err;
        });

        return conn.query(sql, fields).then(res => {
            console.log('fetched');
            return res[0];
        })
        .catch(err =>{
            console.log(err);
            throw err;
        })
        .finally(() => {
            conn.release();
            console.log('released');
        });
    }

    static async TransRequest(conn, sql, fields) {
        return conn.query(sql, fields).then(res => {
            console.log('fetched');
            return res[0];
        })
        .catch(err =>{
            console.log(err);
            throw err;
        });
    }

    static async Transaction(reqQueue) {
        const conn = await this.Pool.getConnection().catch(err => {
            console.log(err);
            throw err;
        });

        try{
            await conn.beginTransaction();
            const result = await reqQueue(conn);
            await conn.commit();
            return result;
        }
        catch(err){
            await conn.rollback();
            console.log(err);
            console.log('rollback');
            throw err;
        }
        finally {
            conn.release();
            console.log('released');
        }
    }
}

export default Entity;