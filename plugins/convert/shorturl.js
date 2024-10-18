import axios from 'axios';

export default {
  name: 'shorten',
  tags: 'convert',
  command: ['shorten', 'shortlink', 'shorturl', 'shortenlink'],
  description: 'Acorta una URL usando TinyURL',
  example: Func.example('%p', '%cmd', 'https://example.com'),
  limit: true,
  run: async(m, { sock, text, command }) => {
    if (!text) {
      return m.reply(Func.example(m.prefix, command, 'https://example.com'));
    }

    try {
      const { data: tinyUrlShortUrl } = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`);
      await sock.sendMessage(m.chat, { 
        text: `Acortado con éxito\n\n*TinyURL: ${tinyUrlShortUrl}*`
      }, { quoted: m });
    } catch (error) {
      console.error('Error al acortar URL:', error);
      m.reply('No se pudo acortar la URL. Por favor, intenta de nuevo más tarde.');
    }
  }
};