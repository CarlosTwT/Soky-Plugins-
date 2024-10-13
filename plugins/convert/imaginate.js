export default {
  name: 'imagen',
  tags: 'convert',
  command: ['imagen', 'imagina', 'photoleap'],
  description: 'Crea una imagen a partir de un texto',
  example: 'imagina Sol frío',
  run: async (m, { sock, text }) => {
    if (!text) return m.reply('Usalo así \n\nimagina Sol frío');
    async function textToImageVsky(text) {
      try {
        const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + encodeURIComponent(text));
        return data;
      } catch (err) {
        return null;
      }
    }
    const result = await textToImageVsky(text);
    if (result && result.result_url) {
      const imageUrl = result.result_url;
      const message = {
        image: { url: imageUrl },
        caption: 'Soky AI'
      };
      sock.sendMessage(m.chat, message);
    } else {
      m.reply('error, inténtalo después.');
    }
  }
}