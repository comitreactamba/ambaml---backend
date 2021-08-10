const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ambaml_db',
});

connection.connect((error) => {
  if (error) {
    console.log('Error al conectar a la BD');
  } else {
    console.log('Conectado a la BD!!!');
  }
});

module.exports = connection;
