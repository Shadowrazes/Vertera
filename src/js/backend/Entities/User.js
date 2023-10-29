import Express from 'express';
class UserEntity{
    static pool;

    static Get(id, response) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                response.status(500).json({ error: 'Ошибка при получении соединения с БД' });
            } 
            else {
                connection.query('SELECT * FROM users', (err, rows) => {
                connection.release();
        
                if (err) {
                    res.status(500).json({ error: 'Ошибка при выполнении запроса к БД' });
                } else {
                    response.status(200).json(rows);
                }
              });
            }
        });
        // const result = pool.query('SELECT * from posts WHERE id = ?', [id]);
        // if (result[0].length < 1) {
        //     throw new Error('Post with this id was not found');
        // }
        // return result[0][0];
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