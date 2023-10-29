import MySQL  from 'mysql2';

const Pool = MySQL.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'cdbyjhsk',
    database: 'vertera'
});

//const a = Pool.getConnection();

// Pool.connect(err => {
//     if (err){
//         console.log('DB connection error')
//     }
//     console.log("DB Connected");
// });

// Pool.query('SELECT * FROM users', function(err, rows, fields) {
//     if (err) throw err;
//     console.log(fields);
// });

export default Pool;