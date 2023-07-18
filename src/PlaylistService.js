const { Pool } = require('pg');
 
class PlaylistServices {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists (userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            JOIN users ON playlists.owner = users.id
            WHERE
              playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [userId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistServices