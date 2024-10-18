import yts from 'yt-search';
import { ytdl } from '../../system/lib/ytscrap.js'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'play',
  tags: 'download',
  command: ['play'],
  description: 'Reproduce música de YouTube',
  example: Func.example('%p', '%cmd', 'photograph'),
  limit: true,
  run: async(m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'photograph'));
    
    try {
      m.reply(global.status.wait);
      
      let search = await yts(text);
      if (!search.videos.length) return m.reply('No se encontraron resultados.');
      
      let videoUrl = search.videos[0].url;
      let response = await ytdl(videoUrl);
      
      if (!response || !response.data || !response.data.mp3) {
        return m.reply('No se pudo obtener el audio. Por favor, intenta con otra canción.');
      }
      
      let audioUrl = response.data.mp3;
      
      await sock.sendMessage(m.chat, { 
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: "audio.mp3",
        contextInfo: {
          externalAdReply: {
            title: search.videos[0].title,
            body: search.videos[0].description,
            thumbnailUrl: search.videos[0].thumbnail,
            sourceUrl: search.videos[0].url
          }
        }
      }, { quoted: m });
      
    } catch (error) {
      console.error('Error en el comando play:', error);
      m.reply('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
    }
  }
};