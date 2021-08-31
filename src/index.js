const express = require('express');

const cors = require('cors');

const session = require('express-session');

const FileStore = require('session-file-store')(session);

const fileUpload = require('express-fileupload');

const publicacionesRoutes = require('./routes/publicaciones');
const categoriasRoutes = require('./routes/categorias');
const authRoutes = require('./routes/auth');
const favoritosRoutes = require('./routes/favoritos');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(fileUpload());

app.use(
  session({
    secret: '123456',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    name: 'ambaml',
  })
);

app.use(express.static('public'));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionesRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/favoritos', favoritosRoutes);

app.listen(8000);
