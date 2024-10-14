import fs from 'fs';
import acrcloud from 'acrcloud';

export default {
  name: 'shazam',
  tags: 'download',
  command: ['shazam', 'find', 'whatmusic'],
  description: 'Identifica la música',
  run: async (m, { sock }) => {
    try {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || q.mediaType || '';

      if (!mime) return m.reply('Por favor, responde a un mensaje de audio o video para identificar la música.');
      if (!/audio|video/.test(mime)) return m.reply('Por favor, responde a un mensaje de audio o video para identificar la música.');

      try {
        let media = await q.download();
        let filePath = `./${Date.now()}.mp3`;
        fs.writeFileSync(filePath, media);

        m.reply('Identificando la música, por favor espere...');

        let acr = new acrcloud({
          host: 'identify-eu-west-1.acrcloud.com',
          access_key: '716b4ddfa557144ce0a459344fe0c2c9',
          access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
        });

        let res = await acr.identify(fs.readFileSync(filePath));
        let { code, msg } = res.status;

        if (code !== 0) {
          throw new Error(msg);
        }

        let { title, artists, album, genres, release_date } = res.metadata.music[0];
        let txt = `𝚁𝙴𝚂𝚄𝙻𝚃 
        • 📌 *TITLE*: ${title}
        • 👨‍🎤 𝙰𝚁𝚃𝙸𝚂𝚃: ${artists ? artists.map(v => v.name).join(', ') : 'NOT FOUND'}
        • 💾 𝙰𝙻𝙱𝚄𝙼: ${album ? album.name : 'NOT FOUND'}
        • 🌐 𝙶𝙴𝙽𝚁𝙴: ${genres ? genres.map(v => v.name).join(', ') : 'NOT FOUND'}
        • 📆 RELEASE DATE: ${release_date || 'NOT FOUND'}
        `.trim();

        fs.unlinkSync(filePath);
        m.reply(txt);
      } catch (error) {
        console.error(error);
        m.reply('Ocurrió un error durante la identificación de la música.');
      }
    } catch (error) {
      console.error('Error:', error);
      m.reply('Ocurrió un error al procesar el comando.');
    }
  }
};