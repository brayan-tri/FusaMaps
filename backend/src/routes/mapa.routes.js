const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/paraderos', async (req, res) => {
try {
    const result = await pool.query(`
        SELECT id, nombre, codigo, direccion,
        ST_X(ubicacion::geometry) as lng,
        ST_Y(ubicacion::geometry) as lat
        FROM paraderos WHERE activo = true
    `);
    res.json({ success: true, data: result.rows });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/rutas', async (req, res) => {
try {
    const result = await pool.query(`
        SELECT id, nombre, descripcion, color_hex, zona, tarifa
        FROM rutas WHERE estado = 'activa'
    `);
    res.json({ success: true, data: result.rows });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
});

module.exports = router;