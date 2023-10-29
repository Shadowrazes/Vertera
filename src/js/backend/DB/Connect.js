import MySQL  from 'mysql2';

const Connection = MySQL.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});
  
Connection.connect(err => {
    if (err) throw error;
    console.log("DB Connected");
});

export default DB;