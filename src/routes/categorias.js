const express = require('express');
const router = express.Router();

const connection = require('../connection');

router.get('/', function (req, res) {
  const sql = `SELECT *
               FROM categorias`;

  connection.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las categorias' });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
