const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../../config/database');
const { validationResult } = require('express-validator');

// ── Helpers ──────────────────────────────────
const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre };
  const accessToken  = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

const sanitize = (u) => ({
  id: u.id, nombre: u.nombre, email: u.email,
  telefono: u.telefono || null, foto_url: u.foto_url || null,
  rol: u.rol, creado_en: u.created_at,
});

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: 'Datos inválidos.',
      errores: errors.array().map(e => ({ campo: e.path, mensaje: e.msg })) });
    return false;
  }
  return true;
};

// ── POST /api/auth/register ───────────────────
exports.register = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;
    const { nombre, email, password, telefono } = req.body;

    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Este correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, telefono, rol)
       VALUES ($1, $2, $3, $4, 'ciudadano') RETURNING *`,
      [nombre.trim(), email, hash, telefono || null]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(user);
    await pool.query('UPDATE usuarios SET refresh_token=$1 WHERE id=$2', [refreshToken, user.id]);

    res.status(201).json({
      success: true,
      message: '¡Bienvenido a FusaMaps!',
      data: { usuario: sanitize(user), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/login ──────────────────────
exports.login = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }

    const user = result.rows[0];
    if (!user.activo) return res.status(403).json({ success: false, message: 'Cuenta desactivada.' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });

    const { accessToken, refreshToken } = generateTokens(user);
    await pool.query('UPDATE usuarios SET refresh_token=$1, ultimo_login=NOW() WHERE id=$2', [refreshToken, user.id]);

    res.json({
      success: true,
      message: '¡Sesión iniciada!',
      data: { usuario: sanitize(user), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/refresh ────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token requerido.' });

    let decoded;
    try { decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); }
    catch { return res.status(403).json({ success: false, message: 'Token expirado. Inicia sesión.' }); }

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id=$1 AND refresh_token=$2 AND activo=true',
      [decoded.id, refreshToken]
    );
    if (result.rows.length === 0) return res.status(403).json({ success: false, message: 'Sesión inválida.' });

    const user = result.rows[0];
    const { accessToken, refreshToken: newRT } = generateTokens(user);
    await pool.query('UPDATE usuarios SET refresh_token=$1 WHERE id=$2', [newRT, user.id]);

    res.json({ success: true, data: { accessToken, refreshToken: newRT } });
  } catch (err) { next(err); }
};

// ── POST /api/auth/logout ─────────────────────
exports.logout = async (req, res, next) => {
  try {
    await pool.query('UPDATE usuarios SET refresh_token=NULL WHERE id=$1', [req.user.id]);
    res.json({ success: true, message: 'Sesión cerrada.' });
  } catch (err) { next(err); }
};

// ── POST /api/auth/forgot-password ───────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const RESP = { success: true, message: 'Si el correo existe recibirás el enlace en minutos.' };
    if (!email) return res.status(400).json({ success: false, message: 'Correo requerido.' });

    const result = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.json(RESP);

    const token   = uuidv4();
    const expires = new Date(Date.now() + 30 * 60 * 1000);
    await pool.query('UPDATE usuarios SET reset_token=$1, reset_token_expires=$2 WHERE id=$3',
      [token, expires, result.rows[0].id]);

    // TODO: enviar email real con nodemailer
    console.log(`🔑 Reset token para ${email}: ${token}`);

    res.json(RESP);
  } catch (err) { next(err); }
};

// ── POST /api/auth/reset-password ────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, nuevaPassword } = req.body;
    if (!token || !nuevaPassword) return res.status(400).json({ success: false, message: 'Token y contraseña requeridos.' });
    if (nuevaPassword.length < 8) return res.status(400).json({ success: false, message: 'Mínimo 8 caracteres.' });

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE reset_token=$1 AND reset_token_expires>NOW()', [token]);
    if (result.rows.length === 0) return res.status(400).json({ success: false, message: 'Token inválido o expirado.' });

    const hash = await bcrypt.hash(nuevaPassword, 12);
    await pool.query(
      'UPDATE usuarios SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL WHERE id=$2',
      [hash, result.rows[0].id]
    );
    res.json({ success: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (err) { next(err); }
};

// ── GET /api/auth/me ──────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id=$1 AND activo=true', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    res.json({ success: true, data: sanitize(result.rows[0]) });
  } catch (err) { next(err); }
};

// ── PUT /api/auth/me ──────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    const { nombre, telefono } = req.body;
    const result = await pool.query(
      `UPDATE usuarios SET
         nombre   = COALESCE(NULLIF($1,''), nombre),
         telefono = COALESCE(NULLIF($2,''), telefono),
         updated_at = NOW()
       WHERE id=$3 RETURNING *`,
      [nombre, telefono, req.user.id]
    );
    res.json({ success: true, message: 'Perfil actualizado.', data: sanitize(result.rows[0]) });
  } catch (err) { next(err); }
};

// ── PUT /api/auth/change-password ─────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    if (!passwordActual || !passwordNueva) return res.status(400).json({ success: false, message: 'Ambas contraseñas requeridas.' });
    if (passwordNueva.length < 8) return res.status(400).json({ success: false, message: 'Mínimo 8 caracteres.' });

    const result = await pool.query('SELECT * FROM usuarios WHERE id=$1', [req.user.id]);
    const ok = await bcrypt.compare(passwordActual, result.rows[0].password_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta.' });

    const hash = await bcrypt.hash(passwordNueva, 12);
    await pool.query('UPDATE usuarios SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, req.user.id]);
    res.json({ success: true, message: 'Contraseña cambiada.' });
  } catch (err) { next(err); }
};
