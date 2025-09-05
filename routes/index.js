const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');

// Página principal (dashboard)
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;