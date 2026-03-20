const connectRedis = async () => {
  console.log('⚠️  Redis desactivado en desarrollo');
};

const redisClient = null;

module.exports = { redisClient, connectRedis };