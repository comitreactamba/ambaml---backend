const express = require('express');
const router = express.Router();

const connection = require('../connection');

router.get('/', (req, res) => {
  const sql = `SELECT *
               FROM publicaciones`;

  connection.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las publicaciones' });
    } else {
      res.json(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const sql = `SELECT *
               FROM publicaciones
               WHERE id = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las publicaciones' });
    } else {
      res.json(result);
    }
  });
});

router.get('/category/:id', (req, res) => {
  const sql = `SELECT *
               FROM publicaciones
               WHERE id_categoria = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las publicaciones' });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
