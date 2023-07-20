const { Pool } = require('pg')

class PlaylistServices {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylists (playlistId) {
    const query = {
      text: `SELECT
              playlists.id AS playlist_id,
              playlists.name AS playlist_name,
              songs.id AS song_id,
              songs.title,
              songs.performer
            FROM
              playlists
            INNER JOIN users ON playlists.owner = users.id
            INNER JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
            INNER JOIN songs ON playlist_songs.song_id = songs.id
            WHERE
              playlists.id = $1`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    const playlistMap = new Map()
    result.rows.forEach((row) => {
      const playlistId = row.playlist_id
      if (!playlistMap.has(playlistId)) {
        playlistMap.set(playlistId, {
          id: playlistId,
          name: row.playlist_name,
          username: row.username,
          songs: []
        })
      }
      const playlist = playlistMap.get(playlistId)
      playlist.songs.push({
        id: row.song_id,
        title: row.title,
        performer: row.performer
      })
    })

    const playlists = Array.from(playlistMap.values())
    return playlists[0]
  }
}

module.exports = PlaylistServices
