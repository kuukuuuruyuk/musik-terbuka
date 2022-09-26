require('dotenv').config();

/**
 * RabbitMQ producer service
 */
class ProducerService {
  /**
   * Producer service
   *
   * @param {any} amqp Amqp lib
   */
  constructor(amqp) {
    this._connection = amqp.connection;
  }
  /**
   * Send message producer
   *
   * @param {any} queue Antrian coy
   * @param {string} message Pesan singkat
   */
  async sendMessage(queue, message) {
    const channel = await this._connection.createChannel();

    await Promise.all([
      channel.assertQueue(queue, {durable: true}),
      channel.sendToQueue(queue, Buffer.from(message)),
    ]);

    setTimeout(() => {
      this._connection.close();
    }, 1000);
  }
}

module.exports = {ProducerService};
