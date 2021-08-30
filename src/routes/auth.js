const express = require('express');
const connection = require('../connection');

const router = express.Router();

router.get('/check', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'ok', data: { name: req.session.user.name } });
  } else {
    res.json({ message: 'error', data: null });
  }
});

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

        req.session.user = {
          name: `${result[0].nombre} ${result[0].apellido}`,
          id: result[0].id,
        };

        console.log(req.session.user);

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
  req.session.destroy((err) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Error al cerrar la sesión', data: null });
    } else {
      res.json({ message: 'Sesión cerrada correctamente', data: null });
    }
  });
});

module.exports = router;
