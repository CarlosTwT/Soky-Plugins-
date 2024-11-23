import axios from 'axios';
import cheerio from 'cheerio';

export default {
  name: 'futbol',
  tags: 'busqueda',
  command: ['futbol', 'jugador', 'footballer'],
  description: 'Busca información de jugadores de fútbol',
  example: Func.example('%p', '%cmd', 'Cristiano Ronaldo'),
  limit: true,
  run: async(m, { sock, text }) => {
    if (!text) return m.reply(`Ingresa el nombre del jugador\nEjemplo: ${m.prefix}futbol Cristiano Ronaldo`);
    
    try {
      m.reply(global.status.wait);
      const data = await Futbol(text);
      
      let caption = `*INFORMACIÓN DEL JUGADOR*\n\n`
      caption += `◦ *Nombre:* ${data.nombre || '-'}\n`
      caption += `◦ *Club:* ${data.club || '-'}\n`
      caption += `◦ *Posición:* ${data.posicion || '-'}\n`
      caption += `◦ *Edad:* ${data.edad || '-'}\n`
      caption += `◦ *País:* ${data.pais || '-'}\n`
      caption += `◦ *Valor de mercado:* ${data.valorMercado || '-'}\n`
      caption += `◦ *Agente:* ${data.agente || '-'}\n\n`
      caption += `_Powered by transfermarkt.com_`
      
      await sock.sendMessage(m.chat, {
        image: { url: data.fotoJugador },
        caption: caption,
        contextInfo: {
          externalAdReply: {
            title: data.nombre,
            body: data.club,
            thumbnailUrl: data.fotoEquipo,
            sourceUrl: data.urlPerfil,
            mediaType: 2,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
      
    } catch (error) {
      console.error(error);
      m.reply('No se encontró información del jugador o ocurrió un error.');
    }
  }
};

async function Futbol(jugador) {
  try {
    const res = await axios.get(`https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(jugador)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(res.data);
    const elem = $('.inline-table').first();
    
    if (!elem.length) throw 'No se encontró información del jugador';
    
    const data = {
      nombre: elem.find('a[title]').first().attr('title'),
      club: elem.find('a[title]').last().attr('title'),
      posicion: elem.closest('tr').find('td.zentriert').eq(0).text().trim(),
      edad: elem.closest('tr').find('td.zentriert').eq(2).text().trim(),
      pais: elem.closest('tr').find('td.zentriert img.flaggenrahmen').attr('title'),
      valorMercado: elem.closest('tr').find('td.rechts.hauptlink').text().trim(),
      agente: elem.closest('tr').find('td.rechts a').last().text().trim(),
      urlPerfil: 'https://www.transfermarkt.com' + elem.find('td.hauptlink a').attr('href'),
      fotoJugador: elem.find('img.bilderrahmen-fixed').attr('src'),
      urlEquipo: 'https://www.transfermarkt.com' + elem.closest('tr').find('td.zentriert a').attr('href'),
      fotoEquipo: elem.closest('tr').find('td.zentriert img.tiny_wappen').attr('src')
    };
    
    return data;
  } catch (error) {
    throw error;
  }
}