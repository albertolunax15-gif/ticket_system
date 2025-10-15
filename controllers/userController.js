'use strict';

const db = require('../models');
const bcrypt = require('bcryptjs');

/**
 * Helpers
 */
const toPlain = (row) => (row ? row.get({ plain: true }) : row);

/**
 * GET /users (vista)
 * Lista de usuarios, ordenada por created_at DESC
 */
exports.listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'username', 'name', 'lastname', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    const plainUsers = users.map(toPlain);

    res.render('users', {
      title: 'Usuarios',
      users: plainUsers
    });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    req.flash('error_msg', 'Error al cargar usuarios');
    res.status(500).render('users', { title: 'Usuarios', users: [] });
  }
};

/**
 * GET /api/users
 * Lista de usuarios en JSON (sin exponer password)
 */
exports.getUsersApi = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'username', 'name', 'lastname', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    res.json(users.map(toPlain));
  } catch (err) {
    console.error('Error en API de usuarios:', err);
    res.status(500).json({ error: 'Error al cargar usuarios' });
  }
};

/**
 * POST /users
 * Crea usuario (encripta password como en el seeder, salt 10)
 * Espera: { username, password, name, lastname }
 */
exports.createUser = async (req, res) => {
  const { username, password, name, lastname } = req.body;

  try {
    if (!username || !password || !name || !lastname) {
      req.flash('error_msg', 'Todos los campos son obligatorios');
      return res.redirect('/users');
    }

    // Encriptar password (igual que el seeder)
    const hashed = await bcrypt.hash(password, 10);

    await db.User.create({
      username,
      password: hashed,
      name,
      lastname
    });

    req.flash('success_msg', '✅ Usuario creado exitosamente');
  } catch (err) {
    console.error('Error al crear usuario:', err);

    // Manejo típico de unicidad de username
    if (err.name === 'SequelizeUniqueConstraintError') {
      req.flash('error_msg', '❌ El nombre de usuario ya está en uso');
    } else {
      req.flash('error_msg', '❌ Error al crear el usuario');
    }
  }

  res.redirect('/users');
};

/**
 * POST /users/:id
 * Actualiza usuario (si viene password, lo re-encripta; si no, se mantiene)
 * Espera: { username?, password?, name?, lastname? }
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, name, lastname } = req.body;

  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      req.flash('error_msg', 'Usuario no encontrado');
      return res.redirect('/users');
    }

    const updates = {
      // Solo actualiza los campos presentes (evita sobreescribir con undefined)
      ...(username ? { username } : {}),
      ...(name ? { name } : {}),
      ...(lastname ? { lastname } : {})
    };

    if (password && password.trim() !== '') {
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(updates);

    req.flash('success_msg', '✅ Usuario actualizado');
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      req.flash('error_msg', '❌ El nombre de usuario ya está en uso');
    } else {
      req.flash('error_msg', '❌ Error al actualizar el usuario');
    }
  }

  res.redirect('/users');
};

/**
 * POST /users/:id/delete
 * Elimina usuario
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      req.flash('error_msg', 'Usuario no encontrado');
      return res.redirect('/users');
    }

    await user.destroy();
    req.flash('success_msg', '🗑️ Usuario eliminado');
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    req.flash('error_msg', '❌ No se pudo eliminar el usuario');
  }

  res.redirect('/users');
};