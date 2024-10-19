import { createRequire } from 'module';
import { S_WHATSAPP_NET } from '@whiskeysockets/baileys';
const require = createRequire(import.meta.url);
const jimp_1 = require('jimp');

export default {
  name: 'setbotpp',
  tags: 'owner',
  command: ['setbotpp', 'setppbot'],
  description: 'Cambiar la foto de perfil del bot',
  owner: true,
  run: async (m, { sock, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
      try {
        let media = await q.download();
        let botNumber = await sock.user.jid;
        let { img } = await pepe(media);
        await sock.query({
          tag: 'iq',
          attrs: {
            to: S_WHATSAPP_NET,
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: img
            }
          ]
        });
        m.reply(`Éxito al cambiar la foto de perfil del Bot`);
      } catch (e) {
        console.log(e);
        m.reply(`Ocurrió un error, inténtalo de nuevo más tarde.`);
      }
    } else {
      m.reply(`Envía una imagen con el título *${m.prefix + command}* o etiqueta una imagen que ya se ha enviado`);
    }
  }
};

async function pepe(media) {
  const jimp = await jimp_1.read(media);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
  };
}