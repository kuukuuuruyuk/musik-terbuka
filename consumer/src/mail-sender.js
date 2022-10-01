/**
 * Mail sender
 */
class MailSender {
  /**
   * Mail sender
   *
   * @param {any} service Service mail sender
   */
  constructor(service) {
    this._transporter = service.transporter;
  }

  /**
   * send email
   *
   * @param {string} targetEmail Email target
   * @param {any} content Emai content
   * @return {any} Info sender
   */
  async sendEmail(targetEmail, content) {
    const message = {
      from: 'Openmusic API',
      to: targetEmail,
      subject: 'Ekspor Playlists',
      text: 'Export Playlists Data',
      attachments: [
        {
          filename: 'playlists.json',
          content,
        },
      ],
    };

    return await this._transporter.sendMail(message);
  }
}

module.exports = {MailSender};
