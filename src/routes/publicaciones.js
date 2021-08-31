const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');

const connection = require('../connection');

router.get('/', (req, res) => {
  const sql = `SELECT id, nombre, imagen, precio
               FROM publicaciones
               ORDER BY precio`;

  connection.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las publicaciones' });
    } else {
      res.json(result);
    }
  });
});

router.get('/mispublicaciones', (req, res) => {
  if (req.session.user) {
    const sql = `SELECT *
                 FROM publicaciones 
                 WHERE publicaciones.id_usuario = ?`;

    connection.query(sql, [req.session.user.id], (err, result) => {
      if (err) {
        res.status(400).json({ message: 'Error al obtener las publicaciones' });
      } else {
        res.json(result);
      }
    });
  } else {
    res.json([]);
  }
});

router.get('/:id', (req, res) => {
  const sql = `SELECT *
               FROM publicaciones
               WHERE id = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error al obtener las publicaciones' });
    } else {
      res.json(result[0]);
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

router.post('/', (req, res) => {
  console.log('REQ.BODY...', req.body);

  let imageFileName = '';

  if (req.files) {
    const pubImage = req.files.pubImage;

    const imageFileExt = path.extname(pubImage.name);

    imageFileName = Date.now() + imageFileExt;

    pubImage.mv(`./public/images/${imageFileName}`, (err) => {
      if (err) {
        console.log('Error al subir el archivo', err);
      } else {
        console.log('Archivo subido correctamente');
      }
    });
  } else {
    console.log('NO SE ENVIARON ARCHIVOS');
  }

  //INSERT A LA BD

  const sql = `INSERT INTO publicaciones(nombre, precio, stock, id_categoria, imagen, id_usuario )
               VALUES(?, ?, ?, ?, ?, ?)`;

  const params = [
    req.body.pubTitle,
    req.body.pubPrice,
    req.body.pubStock,
    req.body.pubCategory,
    imageFileName,
    req.session.user.id,
  ];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al guardar la publicacion' });
    } else {
      res.json({ message: 'Publicación guardada correctamente' });
    }
  });
});

router.put('/:id', (req, res) => {
  let sqlUpdate = `UPDATE publicaciones
                      SET nombre       = ?,
                          precio       = ?,
                          stock        = ?,
                          id_categoria = ?
                  `;

  let values = [
    req.body.pubTitle,
    req.body.pubPrice,
    req.body.pubStock,
    req.body.pubCategory,
  ];

  if (req.files) {
    //Borrar el archivo anterior
    const sql = `SELECT imagen 
                 FROM publicaciones
                 WHERE id = ?`;

    connection.query(sql, [req.params.id], (err, result) => {
      if (err) {
        console.log('Error al obtener el nombre de la imagen');
      } else {
        const imagenBorrar = result[0].imagen;

        fs.unlink(`./public/images/${imagenBorrar}`, (err) => {
          if (err) {
            console.log('Error al eliminar el archivo');
          } else {
            console.log('Archivo borrado correctamente');
          }
        });
      }
    });

    //Subo el nuevo archivo
    const pubImage = req.files.pubImage;

    const imageFileExt = path.extname(pubImage.name);

    imageFileName = Date.now() + imageFileExt;

    pubImage.mv(`./public/images/${imageFileName}`, (err) => {
      if (err) {
        console.log('Error al subir el archivo', err);
      } else {
        console.log('Archivo subido correctamente!!!!!!');
      }
    });

    sqlUpdate += `, imagen = ?`;
    values.push(imageFileName);
  }

  sqlUpdate += ' WHERE id = ?';
  values.push(req.params.id);

  connection.query(sqlUpdate, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error al modificar la publicacion' });
    } else {
      res.json({ message: 'Publicación modificada correctamente' });
    }
  });
});

router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM publicaciones
               WHERE id = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al eliminar la publicacion' });
    } else {
      res.json({ message: 'Publicación eliminada correctamente' });
    }
  });
});

module.exports = router;
