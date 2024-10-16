import axios from 'axios';

export default {
  name: 'ssweb',
  tags: 'tools',
  command: ['ssweb', 'capturaweb'],
  description: 'Captura de pantalla de un sitio web',
  example: Func.example('%p', '%cmd', 'https://www.ejemplo.com'),
  limit: true,
  run: async (m, { sock, text }) => {
    if (!text) return m.reply('Uso: {p}ssweb `<url>`\n\n*Descripción:*\n- *<url>*: La URL del sitio web del que deseas capturar una imagen.');

    let res = null;
    try {
      try {
        res = await axios.get(`https://api.screenshotmachine.com/?key=f74eca&url=${text}&dimension=1920x1080`, { responseType: 'arraybuffer' });
      } catch {
        try {
          res = await axios.get(`https://image.thum.io/get/fullpage/${text}`, { responseType: 'arraybuffer' });
        } catch {
          res = await axios.get(`https://api.screenshotmachine.com/?key=c04d3a&url=${text}&screenshotmachine.com&dimension=720x720`, { responseType: 'arraybuffer' });
        }
      }
      await sock.sendMessage(m.chat, { image: res.data }, { quoted: m });
    } catch (error) {
      await m.reply('Error: ' + error.message);
    }
  }
};