const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/auth/authController');
const { verifyToken } = require('../middlewares/auth');
const { body } = require('express-validator');

const validateRegister = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido.').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Correo inválido.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres.')
    .matches(/[A-Z]/).withMessage('Debe tener al menos una mayúscula.')
    .matches(/[0-9]/).withMessage('Debe tener al menos un número.'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register',        validateRegister, ctrl.register);
router.post('/login',           validateLogin,    ctrl.login);
router.post('/refresh',                           ctrl.refreshToken);
router.post('/logout',          verifyToken,      ctrl.logout);
router.post('/forgot-password',                   ctrl.forgotPassword);
router.post('/reset-password',                    ctrl.resetPassword);
router.get ('/me',              verifyToken,      ctrl.getMe);
router.put ('/me',              verifyToken,      ctrl.updateMe);
router.put ('/change-password', verifyToken,      ctrl.changePassword);

module.exports = router;
