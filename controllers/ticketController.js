const db = require('../models');

// Listar todos los tickets
exports.listTickets = async (req, res) => {
  try {
    const tickets = await db.Ticket.findAll({
      include: [{ 
        model: db.User, 
        as: 'User',
        attributes: ['name', 'lastname']
      }],
      order: [['created_at', 'DESC']]
    });

    // 👇 Convierte a objetos planos antes de pasar a la vista
    const plainTickets = tickets.map(ticket => ticket.get({ plain: true }));

    res.render('tickets', {
      title: 'Listado de Tickets',
      tickets: plainTickets // ← Usa los objetos planos
    });
  } catch (err) {
    console.error('Error al obtener tickets:', err);
    req.flash('error_msg', 'Error al cargar los tickets');
    res.status(500).render('tickets', { title: 'Tickets', tickets: [] });
  }
};

// Serializar a texto plano
exports.getTicketsApi = async (req, res) => {
  try {
    const tickets = await db.Ticket.findAll({
      include: [{ 
        model: db.User, 
        as: 'User',
        attributes: ['name', 'lastname']
      }],
      order: [['created_at', 'DESC']]
    });

    // Convierte a objetos planos antes de enviar como JSON
    const plainTickets = tickets.map(ticket => ticket.get({ plain: true }));

    res.json(plainTickets);
  } catch (err) {
    console.error('Error en API de tickets:', err);
    res.status(500).json({ error: 'Error al cargar tickets' });
  }
};

// Crear ticket
exports.createTicket = async (req, res) => {
  const { subject, category, priority, description } = req.body;
  const userId = req.user.id; // Asume que req.user está disponible

  try {
    await db.Ticket.create({
      userId,
      subject,
      category,
      priority,
      description: description || null,
      status: 'Abierto'
    });

    req.flash('success_msg', '✅ Ticket creado exitosamente');
  } catch (err) {
    console.error('Error al crear ticket:', err);
    req.flash('error_msg', '❌ Error al crear el ticket');
  }

  res.redirect('/tickets');
};

// Actualizar ticket
exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { subject, category, priority, status, description } = req.body;

  try {
    const ticket = await db.Ticket.findByPk(id);
    if (!ticket) {
      req.flash('error_msg', 'Ticket no encontrado');
      return res.redirect('/tickets');
    }

    // Opcional: verificar que el usuario pueda editar (solo admin o dueño)
    // if (ticket.userId !== req.user.id && req.user.role !== 'admin') { ... }

    await ticket.update({
      subject,
      category,
      priority,
      status,
      description: description || null
    });

    req.flash('success_msg', '✅ Ticket actualizado');
  } catch (err) {
    console.error('Error al actualizar ticket:', err);
    req.flash('error_msg', '❌ Error al actualizar el ticket');
  }

  res.redirect('/tickets');
};

// Eliminar ticket
exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await db.Ticket.findByPk(id);
    if (!ticket) {
      req.flash('error_msg', 'Ticket no encontrado');
      return res.redirect('/tickets');
    }

    await ticket.destroy();
    req.flash('success_msg', '🗑️ Ticket eliminado');
  } catch (err) {
    console.error('Error al eliminar ticket:', err);
    req.flash('error_msg', '❌ No se pudo eliminar el ticket');
  }

  res.redirect('/tickets');
};