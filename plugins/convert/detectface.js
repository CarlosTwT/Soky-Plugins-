import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import fetch from 'node-fetch';

export default {
  name: 'detectface',
  tags: 'tools',
  command: ['detectface', 'detectarcara', 'detect-face'],
  description: 'Detecta caras en una imagen',
  run: async (m, { sock }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image/')) { 
      return m.reply('uhmm y la  imagen?*');
    }

    let media = await q.download();
    let formData = new FormData();
    formData.append('image', media, { filename: 'file' });

    try {
      let uploadResponse = await axios.post('https://api.imgbb.com/1/upload?key=10604ee79e478b08aba6de5005e6c798', formData, {
        headers: { ...formData.getHeaders() },
      });

      if (uploadResponse.data.data) {
        let url = uploadResponse.data.data.url;
        let api = await fetch(`https://apis-starlights-team.koyeb.app/starlight/detect-faces?url=${url}`);
        let json = await api.json();
        let { results } = json;

        let txt = '`Y O U R - F A C E`\n\n';
        txt += ` *Forma* : ${results.form}\n`; 
        txt += ` *Genero* : ${results.gender}\n\n`; 
        txt += `> result face`;

        await sock.sendMessage(m.chat, { text: txt }, { quoted: m });
      } else {
        await m.reply('No se pudo detectar la cara en la imagen.');
      }
    } catch (error) {
      console.error(error);
      await m.reply('Ocurrió un error durante el procesamiento.');
    }
  }
}