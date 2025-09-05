const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// Middleware: redirigir si el usuario YA está autenticado (evita ver login)
const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/'); // Si ya está logueado, va al dashboard
};

// Middleware: validación de campos en login
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El usuario es obligatorio')
    .isLength({ min: 3, max: 30 })
    .withMessage('El usuario debe tener entre 3 y 30 caracteres'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 4 })
    .withMessage('La contraseña debe tener al menos 4 caracteres')
];

// GET: Mostrar formulario de login
// Solo accesible si NO está autenticado
router.get('/login', forwardAuthenticated, (req, res) => {
  // Recuperar mensajes y datos previos
  const errors = req.flash('error'); // Passport usa 'error' para fallos
  const success_msg = req.flash('success_msg');
  const user = req.flash('user')[0] || ''; // Mantener username si falló

  res.render('login', {
    title: 'Iniciar Sesión',
    errors: Array.isArray(errors) ? errors : (errors ? [errors] : []),
    success_msg,
    user
  });
});

// POST: Procesar autenticación
router.post('/login', forwardAuthenticated, validateLogin, (req, res, next) => {
  // Validar campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map(err => err.msg);
    req.flash('error', errorMsgs);
    req.flash('user', req.body.username); // Para mantener el username
    return res.redirect('/auth/login');
  }

  // Autenticar con Passport
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true // Usa req.flash('error', 'mensaje')
  })(req, res, next);
});

// GET: Cerrar sesión
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', '✅ Has cerrado sesión correctamente.');
    res.redirect('/auth/login');
  });
});

module.exports = router;