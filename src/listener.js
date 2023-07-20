class Listener {
  constructor (playlistServices, mailSender) {
    this._playlistServices = playlistServices
    this._mailSender = mailSender

    this.listen = this.listen.bind(this)
  }

  async listen (message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString())
      const playlists = await this._playlistServices.getPlaylists(playlistId)
      const output = {
        playlist: {
          id: playlists.id,
          name: playlists.name,
          songs: playlists.songs
        }
      }
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(output, null, 2))
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Listener
