import axios from 'axios';

export default {
  name: 'letra',
  tags: 'download',
  command: ['letra', 'lyrics'],
  description: 'Buscar la letra de una canción',
  example: '%p %cmd Despacito',
  register: true,
  limit: true,
  run: async (m, { sock, text }) => {
    if (!text) return sock.sendMessage(m.chat, { text: `Proporciona el nombre de la canción para buscar la letra. Ejemplo: ${m.prefix}letra Despacito` }, { quoted: m });
    
    try {
      const geniusResponse = await axios.get(`https://deliriussapi-oficial.vercel.app/search/genius?q=${encodeURIComponent(text)}`);
      const geniusData = geniusResponse.data;
      if (!geniusData || !geniusData.length) {
        return sock.sendMessage(m.chat, { text: `No se pudo encontrar ninguna letra para "${text}"` }, { quoted: m });
      }
      
      const lyricsUrl = geniusData[0].url;
      const lyricsResponse = await axios.get(`https://deliriussapi-oficial.vercel.app/search/lyrics?url=${encodeURIComponent(lyricsUrl)}`);
      
      if (lyricsResponse.data && lyricsResponse.data.lyrics) {
        const responseText = `Letra de "${geniusData[0].title}" por ${geniusData[0].artist}:\n\n${lyricsResponse.data.lyrics}`;
        return sock.sendMessage(m.chat, { text: responseText }, { quoted: m });
      } else {
        return sock.sendMessage(m.chat, { text: 'No se pudo obtener la letra de la canción.' }, { quoted: m });
      }
    } catch (error) {
      console.error('Error al buscar la letra:', error);
      return sock.sendMessage(m.chat, { text: 'Ocurrió un error al buscar la letra de la canción. Por favor, inténtalo de nuevo más tarde.' }, { quoted: m });
    }
  }
}
