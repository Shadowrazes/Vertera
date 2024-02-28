import MySQL from 'mysql2';

const isBuild = process.argv[2] === 'build';

const Pool = MySQL.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: !isBuild ? 'root' : 'help_vertera',
    password: !isBuild ? 'cdbyjhsk' : 'EcIEYu2E29eWTjxB',
    database: !isBuild ? 'vertera' : 'help_vertera',
    namedPlaceholders: true
}).promise();

export default Pool;