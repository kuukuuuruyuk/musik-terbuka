/**
 * RabbitMQ producer service
 */
class ProducerService {
  /**
   * Producer service
   *
   * @param {any} amqp Amqp lib
   * @param {string} url Url connect
   */
  constructor(amqp, url) {
    this._amqp = amqp;
    this._url = url;
  }
  /**
   * Send message producer
   *
   * @param {any} queue Antrian coy
   * @param {string} message Pesan singkat
   */
  async sendMessage(queue, message) {
    const connection = await this._amqp.connect(this._url);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {durable: true});
    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  }

  /**
   * Close connection amqp
   */
  close() { }
}

module.exports = {ProducerService};
