import fetch from 'node-fetch';

export default {
  name: 'pinterestdl',
  tags: 'download',
  command: ['pinterestdl'],
  description: 'Descargar contenido de Pinterest',
  example: Func.example('%p', '%cmd', '<URL>'),
  run: async (m, { sock, text }) => {
    if (!text) return m.reply('Por favor, proporciona una URL de Pinterest.');

    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/pinterestdl?url=${encodeURIComponent(text)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Error en la API: ${errorText}`);
      }

      const data = await response.json();

      if (data.status) {
        const { title, description, sourceUrl, download } = data.data;

        let message = `*Título:* ${title}\n*Descripción:* ${description}\n*Fuente:* ${sourceUrl}\n\n`;

        if (download[0].type === 'mp4') {
          message += '...\n';
          await sock.sendMessage(m.chat, {
            video: { url: download[0].download },
            caption: message
          }, { quoted: m });
        } else if (download[0].type === 'jpeg') {
          message += '...\n';
          await sock.sendMessage(m.chat, {
            image: { url: download[0].download },
            caption: message
          }, { quoted: m });
        }
      } else {
        m.reply('No se pudo obtener el contenido de la URL proporcionada.');
      }
    } catch (error) {
      console.error('Error al descargar contenido de Pinterest:', error);
      m.reply(`Ocurrió un error al procesar tu solicitud: ${error.message}`);
    }
  }
};