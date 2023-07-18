class Listener {
  constructor(playlistServices, mailSender) {
    this._playlistServices = playlistServices;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    const { userId, targetEmail } = JSON.parse(message.content.toString());
    const playlists = await this._playlistServices.getPlaylists(userId);
    const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlists));
    console.log(result);
  }
}

module.exports = Listener;