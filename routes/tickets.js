const db = require('../models');
const express = require('express');
const router = express.Router();

// Controladores
const ticketController = require('../controllers/ticketController');

// Validaciones
const { validateTicket } = require('../validators/ticketValidator');

// Middlewares
const { ensureAuthenticated } = require('../middlewares/auth');

// Rutas

// Listado de tickets
router.get('/', ensureAuthenticated, ticketController.listTickets);

// API: para AJAX
router.get('/api', ensureAuthenticated, ticketController.getTicketsApi);

// Crear ticket
router.post(
  '/create',
  ensureAuthenticated,
  validateTicket,
  ticketController.createTicket
);

// Actualizar ticket
router.post(
  '/:id/update',
  ensureAuthenticated,
  validateTicket,
  ticketController.updateTicket
);

// Eliminar ticket
router.post(
  '/:id/delete',
  ensureAuthenticated,
  ticketController.deleteTicket
);

// 🆘 ENDPOINT DE EMERGENCIA — PÉGALO AHORA
router.get('/debug', ensureAuthenticated, async (req, res) => {
  try {
    console.log('🔍 Iniciando consulta de debug...');
    
    // Verificar que los modelos existen
    if (!db.User || !db.Ticket) {
      throw new Error('Modelos User o Ticket no están definidos');
    }

    const tickets = await db.Ticket.findAll({
      include: [{
        model: db.User,
        as: 'User',
        attributes: ['name', 'lastname'],
        required: false // ← No falla si no encuentra usuario
      }],
      limit: 3
    });

    console.log('✅ Consulta exitosa. Ejemplo de ticket:', tickets[0]);
    res.json({ success: true, data: tickets });
  } catch (err) {
    console.error('========================================');
    console.error('💥 ERROR FATAL EN /tickets/debug:');
    console.error('Mensaje:', err.message);
    console.error('Stack completo:', err.stack);
    console.error('========================================');
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;