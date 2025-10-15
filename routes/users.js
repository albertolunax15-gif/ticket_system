// routes/users.js
const db = require('../models');
const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');

// (Opcional) Validaciones
// Si tienes un validador como con tickets, descomenta esta línea:
const { validateUser } = require('../validators/userValidator') || {};

// Middlewares
const { ensureAuthenticated } = require('../middlewares/auth');

/* RUTAS */

// Listado de usuarios (vista) => /users
router.get('/', ensureAuthenticated, userController.listUsers);

// API: para AJAX => /users/api
router.get('/api', ensureAuthenticated, userController.getUsersApi);

// Crear usuario => POST /users/create
router.post(
  '/create',
  ensureAuthenticated,
  // validateUser, // descomenta si tienes el validador
  userController.createUser
);

// Actualizar usuario => POST /users/:id/update
router.post(
  '/:id/update',
  ensureAuthenticated,
  // validateUser, // descomenta si valida también update
  userController.updateUser
);

// Eliminar usuario => POST /users/:id/delete
router.post(
  '/:id/delete',
  ensureAuthenticated,
  userController.deleteUser
);

// 🆘 ENDPOINT DE EMERGENCIA — DEBUG
router.get('/debug', ensureAuthenticated, async (req, res) => {
  try {
    console.log('🔍 Iniciando consulta de debug (users)...');

    if (!db.User) {
      throw new Error('Modelo User no está definido');
    }

    const users = await db.User.findAll({
      attributes: ['id', 'username', 'name', 'lastname', 'created_at', 'updated_at'],
      limit: 3,
      order: [['created_at', 'DESC']]
    });

    console.log('✅ Consulta exitosa. Ejemplo de user:', users[0]);
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('========================================');
    console.error('💥 ERROR FATAL EN /users/debug:');
    console.error('Mensaje:', err.message);
    console.error('Stack completo:', err.stack);
    console.error('========================================');
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;