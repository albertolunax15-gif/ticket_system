const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

module.exports = (passport) => {
  // Estrategia Local: login con username y password
  passport.use(new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
      try {
        // Buscar usuario por username
        const user = await db.User.findOne({ where: { username } });

        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Serializar usuario (guardar en sesión)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializar usuario (recuperar de la BD)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};