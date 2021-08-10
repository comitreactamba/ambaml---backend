const express = require('express');
const connection = require('../connection');

const router = express.Router();

//Iniciar sesion
router.post('/', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);
  //1- Validar el usuario

  const sql = `SELECT * 
               FROM usuarios
               WHERE email = ?
                 AND password = ?`;

  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log('Error al verificar el usuario');
    } else {
      if (result.length === 1) {
        const nombreCompleto = `${result[0].nombre} ${result[0].apellido}`;

        res.json({ message: 'Usuario valido', data: nombreCompleto });
      } else {
        res.status(403).json({
          message: 'Usuario y/o contraseña no validos',
          data: null,
        });
      }
    }
  });
});

//Cerrar sesion
router.delete('/', (req, res) => {
  console.log('cerrar sesion');
});

module.exports = router;
