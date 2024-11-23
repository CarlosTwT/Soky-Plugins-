import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import fetch from 'node-fetch';

export default {
  name: 'similarface',
  tags: 'convert',
  command: ['similitudface', 'facesimilar', 'similarface'],
  description: 'Encuentra caras similares en una imagen',
  run: async (m, { sock }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image/')) {
      return m.reply('*y la imagen?.*');
    }

    let media = await q.download();
    let formData = new FormData();
    formData.append('image', media, { filename: 'file' });

    try {
      let uploadResponse = await axios.post('https://api.imgbb.com/1/upload?key=10604ee79e478b08aba6de5005e6c798', formData, { headers: { ...formData.getHeaders() }});

      if (uploadResponse.data.data) {
        let url = uploadResponse.data.data.url;
        let api = await fetch(`https://apis-starlights-team.koyeb.app/starlight/face-similar?url=${url}`);
        let json = await api.json();
        let { name, image, similar, others } = json;

        let txt = '`S I M I L A R  -  F A C E`\n\n';
        txt += `*${name}*\n`;
        txt += `*similitud* : ${similar}\n\n`;
        txt += ` by Soky Ai`;

        await sock.sendMessage(m.chat, { image: { url: image }, caption: txt }, { quoted: m });

        if (others && others.length > 0) {
          for (let other of others) {
            await sock.sendMessage(m.chat, { image: { url: other.image }, caption: `${other.name}` }, { quoted: m });
          }
        }
      } else {
        await m.reply('No se pudo encontrar caras similares en la imagen.');
      }
    } catch (error) {
      console.error(error);
      await m.reply('Ocurrió un error durante el procesamiento.');
    }
  }
}