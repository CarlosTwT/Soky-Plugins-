import pkg from 'sanzy-spotifydl';
const { downloadTrack, downloadAlbum, search } = pkg;
import fetch from 'node-fetch';
import pkg2 from 'fluid-spotify.js';
const { Spotify } = pkg2;

export default {
  name: 'spotify',
  tags: 'download',
  command: ['spotify'],
  description: 'Descarga música de Spotify',
  example: Func.example('%p', '%cmd', 'https://open.spotify.com/track/1234567890'),
  register: true,
  run: async (m, { sock, text }) => {
    if (!text) return m.reply('Ingresa el enlace de algún Track, PlayList o Álbum de Spotify.');
    
    let isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
    if (!isSpotifyUrl && !text) return m.reply('Ingresa el enlace de algún Track, Playlist o Álbum de Spotify.');
    
    try {
      if (isSpotifyUrl) {
        if (isSpotifyUrl[2] === 'album') {
          let album = await downloadAlbum(isSpotifyUrl[0]);
          let img = await (await fetch(`${album.metadata.cover}`)).buffer();
          let txt = `* S P O T I F Y  -  D O W N L O A D*\n\n`;
          txt += `  *Album* : ${album.metadata.title}\n`;
          txt += `   *Artista* :${album.metadata.artists}\n`;
          txt += `   *Publicado* : ${album.metadata.releaseDate}\n`;   
          txt += `   *Tracks totales* : ${album.trackList.length}\n\n`;   
          txt += `*-by Soky AI*`;
          
          await sock.sendMessage(m.chat, { image: img, caption: txt }, { quoted: m });
          
          for (let i = 0; i < album.trackList.length; i++) {
            await sock.sendMessage(m.chat, { 
              audio: album.trackList[i].audioBuffer, 
              fileName: album.trackList[i].metadata.name + '.mp3',
              mimetype: 'audio/mpeg'
            }, { quoted: m });
          }
        } else if (isSpotifyUrl[2] === 'track') {
          let track = await downloadTrack(isSpotifyUrl[0]);
          let dlspoty = track.audioBuffer;
          let img = await (await fetch(`${track.imageUrl}`)).buffer();
          let txt = `* S P O T I F Y  -  D O W N L O A D*\n\n`;
          txt += `   *Título* : ${track.title}\n`;
          txt += `   *Artista* : ${track.artists}\n`;
          txt += `   *Duración* : ${track.duration}\n`;
          txt += `   *Album* : ${track.album.name}\n`;                 
          txt += `   *Publicado* : ${track.album.releasedDate}\n\n`;   
          txt += `*- by Soky AI*`;
          
          await sock.sendMessage(m.chat, { image: img, caption: txt }, { quoted: m });
          await sock.sendMessage(m.chat, { 
            audio: dlspoty, 
            fileName: track.title + '.mp3',
            mimetype: 'audio/mpeg'
          }, { quoted: m });
         } else if (isSpotifyUrl[2] === 'playlist') {
          let infos = new Spotify({
            clientID: "7fb26a02133d463da465671222b9f19b",
            clientSecret: "d4e6f8668f414bb6a668cc5c94079ca1",
          });
          let playlistId = isSpotifyUrl[0].split('/').pop();
          let playlistInfoByID = await infos.getPlaylist(playlistId);
          let tracks = playlistInfoByID.tracks.items;
          let img = await (await fetch(`${playlistInfoByID.images[0].url}`)).buffer();
          let txt = `* S P O T I F Y  -  D O W N L O A D*\n\n`;
          txt += `   *Playlist* : ${playlistInfoByID.name}\n`;
          txt += `   *Tracks totales* : ${tracks.length}\n\n`;
          txt += `*- by Soky AI*`;
          
          await sock.sendMessage(m.chat, { image: img, caption: txt }, { quoted: m });
          
          let target = m.chat;
          if (m.isGroup && tracks.length > 20) {
            target = m.sender;
          }
          
          for (let i = 0; i < tracks.length; i++) {
            let track = await downloadTrack(tracks[i].track.external_urls.spotify);
            await sock.sendMessage(target, { 
              audio: track.audioBuffer, 
              fileName: tracks[i].track.name + '.mp3',
              mimetype: 'audio/mpeg'
            }, { quoted: m });
          }
        }
      } else {
        let searchTrack = await downloadTrack(text);
        let dlspoty = searchTrack.audioBuffer;
        let img = await (await fetch(`${searchTrack.imageUrl}`)).buffer();
        let txt = `* S P O T I F Y  -  D O W N L O A D*\n\n`;
        txt += `   *Título* : ${searchTrack.title}\n`;
        txt += `   *Artista* : ${searchTrack.artists}\n`;
        txt += `   *Duración* : ${searchTrack.duration}\n`;
        txt += `   *Album* : ${searchTrack.album.name}\n`;                 
        txt += `   *Publicado* : ${searchTrack.album.releasedDate}\n\n`;   
        txt += `*- by Soky AI*`;
        
        await sock.sendMessage(m.chat, { image: img, caption: txt }, { quoted: m });
        await sock.sendMessage(m.chat, { 
          audio: dlspoty, 
          fileName: searchTrack.title + '.mp3',
          mimetype: 'audio/mpeg'
        }, { quoted: m });
      }
    } catch (error) {
      console.error('Error en el comando Spotify:', error);
      m.reply('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
    }
  }
};