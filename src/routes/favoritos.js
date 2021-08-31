const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/', function (req, res) {
  const sql = `SELECT id, nombre, imagen, precio 
               FROM favoritos, publicaciones
               WHERE usr_id = ? AND favoritos.pub_id = publicaciones.id`;

  connection.query(sql, [req.session.user.id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener los favoritos' });
    } else {
      res.json(result);
    }
  });
});

router.post('/', function (req, res) {
  const sql = `INSERT INTO favoritos(usr_id, pub_id)
               VALUES(?, ?)`;

  const values = [req.session.user.id, req.body.pubId];

  connection.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al agregar a favoritos' });
    } else {
      res.json({ message: 'Agregado a favoritos' });
    }
  });
});

router.delete('/', (req, res) => {
  const sql = `DELETE FROM favoritos
                 WHERE usr_id = ? 
                   AND pub_id = ?`;

  const values = [req.session.user.id, req.body.pubId];

  connection.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al eliminar de favoritos' });
    } else {
      res.json({ message: 'Eliminado' });
    }
  });
});

module.exports = router;
