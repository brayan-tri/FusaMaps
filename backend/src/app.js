require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { connectDB }    = require('./config/database');
const { connectRedis } = require('./config/redis');
const routes           = require('./routes/index');
const errorHandler     = require('./middlewares/errorHandler');
const rateLimiter      = require('./middlewares/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'FusaMaps API', version: '1.0.0' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`\n🚌 FusaMaps API corriendo en http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start();
module.exports = app;
