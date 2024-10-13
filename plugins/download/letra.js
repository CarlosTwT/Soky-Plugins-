export default {
  name: 'letra',
  tags: ['download'],
  command: ['letra'],
  description: 'Buscar la letra de una canción',
  example: 'letra <nombre de la canción>',
  register: true,
  run: async (m, { sock, text }) => {
    if (!text) throw `Proporciona el nombre de la canción para buscar la letra.`;
    
    const geniusResponse = await axios.get(`https://apilyrics.vercel.app/genius?query=${text}`);
    const geniusData = geniusResponse.data;
    if (!geniusData.length) throw `No se pudo encontrar ninguna letra para "${text}"`;
    
    const lyricsUrl = geniusData[0].url;
    const lyricsResponse = await axios.get(`https://apilyrics.vercel.app/lyrics?url=${lyricsUrl}`);
    
    m.reply(lyricsResponse.data.lyrics);
  }
}