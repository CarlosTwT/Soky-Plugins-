import fetch from 'node-fetch';

export default {
  name: 'mediafire',
  tags: 'download',
  command: ['mediafire'],
  description: 'Descarga archivos de Mediafire',
  example: Func.example('%p', '%cmd', 'https://mediafire.com/yourfile'),
  limit: false,
  run: async(m, { sock, text, command }) => {
    const q = text; // Asigna el texto del comando a la variable q
    if (!q) return m.reply('¿Dónde está el enlace?');

    try {
      m.reply(global.status.wait);
      const ha = await fetch(`https://deliriussapi-oficial.vercel.app/download/mediafire?url=${encodeURIComponent(q)}`);
      const data = await ha.json();

      if (!data || !data.data || !data.data.link) {
        return m.reply('No se pudo obtener el enlace de descarga. Por favor, verifica el enlace de Mediafire.');
      }

      await sock.sendMessage(m.chat, {
        document: {
          url: data.data.link,
        },
        mimetype: '*/*',
        fileName: data.data.filename
      }, {
        quoted: m,
      });
    } catch (error) {
      console.error('Error en el comando mediafire:', error);
      m.reply('Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
    }
  }
};