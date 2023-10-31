import MySQL  from 'mysql2';

const Pool = MySQL.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'cdbyjhsk',
    database: 'vertera'
});

export default Pool;