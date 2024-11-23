import axios from 'axios';
import yts from 'yt-search';

export default {
  name: 'deezer',
  tags: 'download',
  command: ['deezer', 'deezermusic', 'dzr'],
  description: 'Busca y descarga música de Deezer',
  example: Func.example('%p', '%cmd', 'Joji'),
  run: async(m, { sock, text }) => {
    if (!text) return m.reply(`✧Ejemplo: ${m.prefix}deezer revenge`);
    
    try {
      let searchMusicDeezerFind = (await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(text)}`)).data;
      if (searchMusicDeezerFind.data.length == 0) return m.reply(`No hay resultados de la api!`);

      const artistName = searchMusicDeezerFind.data[0].artist.name;
      const songTitle = searchMusicDeezerFind.data[0].title;

      let ABC = await yts(`${artistName} ${songTitle}`);
      let informationVideoYT = ABC.videos[0];

      const deezerMessage = `_*DEEZER MUSIC*_

✧ Título: ${songTitle}
✧ Artista: ${artistName}
✧ Álbum: ${searchMusicDeezerFind.data[0].album.title}
✧ Duración: ${searchMusicDeezerFind.data[0].duration} Segundos
✧ Explícito: ${searchMusicDeezerFind.data[0].explicit_lyrics ? 'Sí' : 'No'}
✧ Link artista: ${searchMusicDeezerFind.data[0].artist.link}
✧ Link álbum: ${searchMusicDeezerFind.data[0].album.tracklist.replace('api.', '')}
✧ Link Deezer: ${searchMusicDeezerFind.data[0].link}`;

      await sock.sendFThumb(m.chat, global.set.wm, deezerMessage, informationVideoYT.thumbnail, searchMusicDeezerFind.data[0].link, m);
      await sock.sendMessage(m.chat, {
        audio: { url: searchMusicDeezerFind.data[0].preview },
        mimetype: 'audio/mpeg'
      }, { quoted: m }).catch(e => {
        console.log(e);
      });

    } catch (e) {
      console.log(e);
      m.reply("Error / Api caída");
    }
  }
};