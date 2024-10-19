/* import yts from 'yt-search';

export default {
name: 'youtubevideo',
  tags: 'download',
  command: ['youtubevideo', 'ytv', 'ytmp4'],
  description: 'descarga videos de youtube',
  example: Func.example('%p', '%cmd', 'https://youtube.com/watch?v=ZRtdQ81jPUQ'),
  limit: true,
  run: async (m, { sock, text, command }) => {
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
      
      await sock.sendFThumb(m.chat, global.set.wm, ca, yt[0].thumbnail, yt[0].url, m);
            
      let got = await (await import("got")).default
      const response = await got.post("https://submagic-free-tools.fly.dev/api/youtube-info", {
        json: {
          "url": yt[0].url
        }
      }).json();

      let ns = response.formats.length
      let xSize = Func.sizeLimit('100', global.set.max_upload)
      if (xSize.oversize) return m.reply(`El tamaño del archivo (100 MB) es demasiado grande; descárguelo usted mismo a través de este enlace : ${yt[0].url}`)

      await sock.sendMessage(m.chat, { document: { url: response.formats[0].url },  mimetype: 'video/mp4', fileName: yt[0].title + '.mp4' }, { quoted: m });

    } catch (e) {
      console.log(e)
      return m.reply(global.status.error)
    }
  }
}
*/
import yts from 'yt-search';
import { ytmp4 } from 'ruhend-scraper';

export default {
  name: 'ytmp4',
  tags: 'download',
  command: ['ytmp4', 'ytv'],
  description: 'Descargar video de YouTube',
  example: Func.example('%p', '%cmd', 'https://youtu.be/MvsAesQ-4zA'),
  limit: true,
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