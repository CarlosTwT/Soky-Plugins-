import { scraperPinterest } from '../../system/lib/pinterestScraper.js';
import { sendCarousel } from '../../system/lib/simple.js';


export default {
  name: 'pin',
  tags: 'download',
  command: ['pin', 'pinterest'],
  description: 'Encuentra tus imagenes favoritas aquí',
  example: '',
  limit: false,
  run: async (m, { text }) => {
    if (!text) {
      return m.reply('Acción mal hecha, ejemplo: /pin gatos');
    }

    try {
      const result = await scraperPinterest(text);
      const messages = [];
      let i = 0;

      result.forEach(element => {
        i++
        messages.push([
          `Resultado ${i}`,
          "Create by Dev's Socky-Plugins",
          element, 
          [],
          [],
          [['Website', element]], 
          [] 
        ]);
      });

      await sendCarousel(m.chat, `> *[ Pinterest Search ]*`, `Busqueda: ${text}\nResultados: ${result.length}`, `> *${text.toUpperCase()}*`, messages, m, { });

    } catch (error) {
      console.error('Error en el comando Pinterest:', error);
    }
  }
}
