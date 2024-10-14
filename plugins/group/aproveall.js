export default {
  name: 'approveall',
  tags: 'group',
  command: ['approveall'],
  description: 'Aprobar todas las solicitudes pendientes de unirse al grupo',
  group: true,
  admin: true,
  botAdmin: true,
  run: async (m, { sock }) => {
    try {
      const responseList = await sock.groupRequestParticipantsList(m.chat);

      if (responseList.length === 0) throw 'No hay solicitudes pendientes en este momento.';

      for (const participant of responseList) {
        const response = await sock.groupRequestParticipantsUpdate(
          m.chat, 
          [participant.jid], 
          "approve"
        );
        console.log(response);
      }
      m.reply('Todas las solicitudes pendientes han sido aprobadas para unirse al grupo.');
    } catch (error) {
      m.reply('Ocurrió un error: ' + error);
    }
  }
};