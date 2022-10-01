require('dotenv').config();

const {Pool} = require('pg');
const amqp = require('amqplib');
const redis = require('redis');
const nodemailer = require('nodemailer');
// Service
const {PlayistsService} = require('./src/playists-service');
const {MailSender} = require('./src/mail-sender');
const {Listener} = require('./src/listener');
const {CacheControl} = require('./src/cache/cache-control');
const {InvariantError} = require('./src/exception/invariant-error');

const initConsumer = async () => {
  const dbPool = new Pool();
  const redisConfig = () => {
    const client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER_HOST,
      },
    });

    client.on('error', (error) => {
      throw new InvariantError(error);
    });

    client.connect();

    return client;
  };
  const cacheControl = new CacheControl({redis: redisConfig()});
  const playistsService = new PlayistsService(dbPool, {cacheControl});
  const mailSender = new MailSender({
    transporter: nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    }),
  });
  const listener = new Listener({playistsService, mailSender});

  const initRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {durable: true});

    channel.consume('export:playlists', listener.eventListener, {noAck: true});
  };

  initRabbitMQ();
};

initConsumer();
