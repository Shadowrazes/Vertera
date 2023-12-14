import _ from 'lodash';

class Entity{
    static Pool;
    static EmptyUpdateInfo = { affected: 0, changed: 0, warning: 0 };

    static ArgsSize(obj) {
        return Object.keys(obj).length;
    }

    static IsArgsEmpty(obj) {
        return _.isEmpty(obj);
    }

    static async GetFutureIdAI(tableName) {
        const tableInfo = await this.Request(`SHOW CREATE TABLE ${tableName}`);
        const regexp = /AUTO_INCREMENT=(\d+)/;
        const regexResult = tableInfo[0]['Create Table'].match(regexp);
        const futureId = parseInt(regexResult[1]);
        return futureId;
    }

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