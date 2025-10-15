'use strict';

// routes/users.js
const db = require('../models');
const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');

// Middlewares
const { ensureAuthenticated } = require('../middlewares/auth');

// (Opcional) Validaciones — seguro aunque no exista el archivo o la exportación
let validateUser = (req, res, next) => next();
try {
  const maybeValidator = require('../validators/userValidator');
  if (maybeValidator && typeof maybeValidator.validateUser === 'function') {
    validateUser = maybeValidator.validateUser;
  }
} catch (_) {
  // sin validador: no-op
}

/* ================== RUTAS ================== */

// Listado de usuarios (vista) => GET /users
router.get('/', ensureAuthenticated, userController.listUsers);

// API: para AJAX => GET /users/api
router.get('/api', ensureAuthenticated, userController.getUsersApi);

// Crear usuario => POST /users/create
router.post('/create', ensureAuthenticated, validateUser, userController.createUser);

// Actualizar usuario => POST /users/:id/update
router.post('/:id/update', ensureAuthenticated, validateUser, userController.updateUser);

// Eliminar usuario => POST /users/:id/delete
router.post('/:id/delete', ensureAuthenticated, userController.deleteUser);

// 🆘 DEBUG: GET /users/debug
router.get('/debug', ensureAuthenticated, async (req, res) => {
  try {
    if (!db.User) throw new Error('Modelo User no está definido');

    const users = await db.User.findAll({
      attributes: ['id', 'username', 'name', 'lastname', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
      limit: 3
    });

    res.json({ success: true, data: users });
  } catch (err) {
    console.error('💥 ERROR FATAL EN /users/debug:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;