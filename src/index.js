const express = require('express');

const cors = require('cors');

const publicacionesRoutes = require('./routes/publicaciones');
const categoriasRoutes = require('./routes/categorias');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.static('public'));

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionesRoutes);
app.use('/categorias', categoriasRoutes);

app.listen(8000);
