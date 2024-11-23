/*import yts from 'yt-search';

export default {
  name: 'play',
  tags: 'download',
  command: ['play'],
  description: 'Encuentra tu música favorita aquí',
  limit: true,
  run: async (m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'spiral by longman'));
    m.reply(global.status.wait);

    try {
      let yt = await (await yts(text)).all;
      let got = await (await import("got")).default
      let old = new Date();

      let ca = `*[ YouTube Play ]*\n\n`;
      ca += `*-* *Título* : ` + yt[0].title + `\n`;
      ca += `*-* *Duración* : ` + yt[0].timestamp + `\n`;
      ca += `*-* *Viewer* : ` + yt[0].views + `\n`;
      ca += `*-* *Hace* : ` + yt[0].ago + '\n';
      ca += `*-* *Link* : ` + yt[0].url + `\n`;
      ca += `*-* *Download* : ${((new Date - old) * 1)} 2-3minutos\n\n`;
      ca += global.set.footer;

      await sock.sendFThumb(m.chat, global.set.wm, ca, yt[0].thumbnail, yt[0].url, m)

      let response = await got.post("https://submagic-free-tools.fly.dev/api/youtube-info", {
        json: {
          "url": yt[0].url
        }
      }).json()

      let xSize = Func.sizeLimit('100', global.set.max_upload)
      if (xSize.oversize) return m.reply(`El tamaño del archivo (100 MB) es demasiado grande; descárguelo usted mismo a través de este enlace : ${yt[0].url}`)

      await sock.sendMessage(m.chat, { audio: { url: response.formats[0].url }, mimetype: "audio/mpeg" }, { quoted: m })

    } catch (e) {
      console.log(e)
      return m.reply(global.status.error)
    }
  }
}
*/
import yts from 'yt-search';
import { ytdl } from '../../system/lib/ytscrap.js'; 

export default {
  name: 'play',
  tags: 'download',
  command: ['play'],
  description: 'Reproduce música de YouTube',
  example: Func.example('%p', '%cmd', 'photograph'),
  limit: false,
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
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: search.videos[0].title,
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