const express = require('express');
const router = express.Router();

// Controlador de usuarios
const userController = require('../controllers/userController');

// Middleware (si quieres proteger las rutas con login)
const { ensureAuthenticated } = require('../middlewares/auth');

// Rutas de usuarios

// Listar usuarios (vista)
router.get('/', ensureAuthenticated, userController.listUsers);

// API de usuarios (JSON)
router.get('/api', ensureAuthenticated, userController.getUsersApi);

// Crear usuario
router.post('/create', ensureAuthenticated, userController.createUser);

// Actualizar usuario
router.post('/:id/update', ensureAuthenticated, userController.updateUser);

// Eliminar usuario
router.post('/:id/delete', ensureAuthenticated, userController.deleteUser);

module.exports = router;