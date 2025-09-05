const { body } = require('express-validator');

const validateTicket = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('El asunto es obligatorio')
    .isLength({ max: 255 })
    .withMessage('El asunto no puede exceder 255 caracteres'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es obligatoria'),

  body('priority')
    .isIn(['Baja', 'Media', 'Alta', 'Crítica'])
    .withMessage('Prioridad inválida'),

  body('status')
    .optional()
    .isIn(['Abierto', 'En Proceso', 'Cerrado', 'Resuelto'])
    .withMessage('Estado inválido'),

  body('description')
    .optional()
    .trim()
];

module.exports = { validateTicket };