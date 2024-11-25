import yts from 'yt-search';
import { ytmp4 } from 'ruhend-scraper';

export default {
  name: 'ytmp4',
  tags: 'download',
  command: ['ytmp4', 'ytv'],
  description: 'Descargar video de YouTube',
  example: Func.example('%p', '%cmd', 'https://youtu.be/MvsAesQ-4zA'),
  limit: false,
  run: async (m, { sock, text, prefix, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'spiral by longman'));
    m.reply(global.status.wait);
    try {
      let yt = await (await yts(text)).all;
      let old = new Date();

      let ca = `*[ YouTube Play ]*\n\n`;
      ca += `*-* *Título* : ` + yt[0].title + `\n`;
      ca += `*-* *Duración* : ` + yt[0].timestamp + `\n`;
      ca += `*-* *Viewer* : ` + yt[0].views + `\n`;
      ca += `*-* *Hace* : ` + yt[0].ago + '\n';
      ca += `*-* *Link* : ` + yt[0].url + `\n`;
      ca += `*-* *Download* : 1-2 minutos\n\n`;
      ca += global.set.footer;
      const { video } = await ytmp4(yt[0].url);
      
      await sock.sendFThumb(m.chat, global.set.wm, ca, yt[0].thumbnail, yt[0].url, m); 
      await sock.sendMessage(m.chat, { document: { url: video },  mimetype: 'video/mp4', fileName: yt[0].title + '.mp4' }, { quoted: m });
    } catch (error) {
      console.error(error);
      m.reply('Ocurrió un error al procesar el video. Por favor, intenta con otro enlace o más tarde.');
    }
  }
};
