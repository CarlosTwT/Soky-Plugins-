export default {
  name: 'getjoinrequest',
  tags: 'group',
  command: ['getjoinrequest', 'joinrequest', 'requestlist'],
  description: 'Ver las solicitudes pendientes para unirse al grupo',
  example: '',
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock }) => {
    try {
      const response = await sock.groupRequestParticipantsList(m.chat);
      
      if (!response || response.length === 0) {
        return m.reply('No hay solicitudes pendientes para unirse al grupo ✅');
      }
      
      let replyMessage = `*[ SOLICITUDES PENDIENTES ]*\n\n`;
      response.forEach((request, index) => {
        const { jid, request_method, request_time } = request;
        const formattedTime = new Date(parseInt(request_time) * 1000).toLocaleString();
        
        replyMessage += `*Solicitud N°${index + 1}*\n`;
        replyMessage += `*-* *Usuario:* @${jid.split('@')[0]}\n`;
        replyMessage += `*-* *Método:* ${request_method}\n`;
        replyMessage += `*-* *Fecha:* ${formattedTime}\n`;
        replyMessage += `°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`;
      });
      replyMessage += global.set.footer;
      await sock.sendMessage(m.chat, {
        text: replyMessage,
        mentions: response.map(req => req.jid)
      }, {
        quoted: m
      });

    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      m.reply(global.status.error);
    }
  }
};