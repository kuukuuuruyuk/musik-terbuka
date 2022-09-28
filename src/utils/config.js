const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
    storage: process.env.UPLOADS_DIRECTORY,
    truncateToken: process.env.MYTRUNCATE_TOKEN,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  token: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    tokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;
