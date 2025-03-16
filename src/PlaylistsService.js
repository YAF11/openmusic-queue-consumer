const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    // Query untuk mendapatkan data playlist
    const playlistQuery = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    
    // Jika playlist tidak ditemukan
    if (!playlistResult.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    // Query untuk mendapatkan daftar lagu di dalam playlist
    const songsQuery = {
      text: `
        SELECT songs.id, songs.title, songs.performer 
        FROM songs
        LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);
    const songs = songsResult.rows; 

    const response = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songs,
      },
    };

    console.log(response); 
    return response;
  }
}

module.exports = PlaylistService;
