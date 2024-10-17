import fetch from 'node-fetch';

export default {
  name: 'rule34',
  tags: 'download',
  command: ['rule34', 'rule'],
  description: 'Busca imágenes en Rule34 basadas en etiquetas.',
  example: 'Ejemplo de uso: /rule34 Alya',
  run: async (m, { sock, text }) => {
    if (!text) {
      throw `*Por favor, ingresa un texto*\n*Ejemplo:* /rule34 Alya`;
    }

    try {
      sock.reply(m.chat, '*Enviando Resultados...*', m);
      sock.sendPresenceUpdate('composing', m.chat);
      
      const apiUrl = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(text)}&json=1`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Error en la solicitud a la API');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No se encontraron imágenes');
      }

      // Selecciona imágenes aleatorias
      const imagesToDownload = data.sort(() => 0.5 - Math.random()).slice(0, 2);
      for (const post of imagesToDownload) {
        const imageResponse = await fetch(post.file_url);
        if (!imageResponse.ok) {
          throw new Error('Error al descargar la imagen');
        }
        const imageBuffer = await imageResponse.buffer();

        await sock.sendMessage(m.chat, { image: imageBuffer, caption: `Imagen de Rule34: ${post.tags || 'Sin etiquetas'}` }, { quoted: m });
      }

    } catch (error) {
      console.error(error);
      sock.reply(m.chat, `*Ocurrió un error:* ${error.message}`, m);
    }
  }
};