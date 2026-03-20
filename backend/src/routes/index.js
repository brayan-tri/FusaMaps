const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/mapa', require('./mapa.routes'));

module.exports = router;