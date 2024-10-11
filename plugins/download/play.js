import yts from 'yt-search';

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

      const response = await got.post("https://submagic-free-tools.fly.dev/api/youtube-info", {
        json: {
          "url": yt[0].url
        }
      }).json();

      let ns = response.formats.length
      let xSize = Func.sizeLimit('100', global.set.max_upload)
      if (xSize.oversize) return m.reply(`El tamaño del archivo (100 MB) es demasiado grande; descárguelo usted mismo a través de este enlace : ${yt[0].url}`)

      await sock.sendMessage(m.chat, { audio: { url: response.formats[ns - 3].url }, mimetype: "audio/mpeg" }, { quoted: m })

    } catch (e) {
      console.log(e)
      return m.reply(global.status.error)
    }
  }
}
