import fetch from 'node-fetch';

export default {
  name: 'carbon',
  tags: 'convert',
  command: ['carbon'],
  description: 'Convierte código en una imagen',
  run: async (m, { sock }) => {
    try {
      if (!m.quoted) throw 'Responde a un mensaje o algún código';

      const forq = m.quoted.text;

      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) throw 'API failed to fetch a valid response.';

      let per = await response.buffer();

      await sock.sendMessage(m.chat, { image: per, caption: 'Converted By Soky' }, { quoted: m });
    } catch (error) {
      await sock.reply(m.chat, 'Ocurrió un error: ' + error);
    }
  }
};