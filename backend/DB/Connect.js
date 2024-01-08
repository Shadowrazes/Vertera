import MySQL  from 'mysql2';

const isBuild = process.argv[2] === 'build';

const Pool = MySQL.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: !isBuild ? 'root' : 'mysqladmin',
    password: !isBuild ? 'cdbyjhsk' : 'uoyoi9Uroi7v',
    database: 'vertera',
    namedPlaceholders: true
}).promise();

export default Pool;