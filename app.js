// 1. Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 2. Importar dependencias
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const path = require('path');
const MySQLStore = require('express-mysql-session')(session); // ← Usa la misma sesión

// 3. Importar modelos y configurar BD
const db = require('./models');

// 4. Importar rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

// 5. Inicializar app
const app = express();

// 6. Configuración de vistas
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 7.5. ¡TRUST PROXY! (Render está detrás de un proxy)
app.set('trust proxy', 1);

// 7. Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 8. Sesiones — ¡CORREGIDO PARA MYSQL EN RENDER!
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'clave-secreta-muy-segura',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);

// 9. Autenticación
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// 10. Flash messages
app.use(flash());

// 11. Variables globales para vistas
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// 12. Rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

// 13. Sincronizar BD y levantar servidor
const PORT = app.get('port');

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });

// 14. Exportar app
module.exports = app;