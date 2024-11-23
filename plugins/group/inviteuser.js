export default {
  name: 'invite',
  tags: 'group',
  command: ['invite', 'invitar'],
  description: 'Invitar a alguien al grupo mediante su número',
  example: Func.example('%p', '%cmd', '51999999999'),
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock, text }) => {
    try {

      if (!text) {
        return m.reply(`Ingresa el número que deseas invitar al grupo\n\nEjemplo:\n*${m.prefix}invite* 51999999999`);
      }
      if (text.includes('+')) {
        return m.reply('Ingresa el número sin el símbolo *+*');
      }

      if (isNaN(text)) {
        return m.reply('Ingresa solo números incluyendo el código de país sin espacios');
      }
      const group = m.chat;
      const link = 'https://chat.whatsapp.com/' + await sock.groupInviteCode(group);

      let inviteMessage = `*[ INVITACIÓN A GRUPO ]*\n\n`;
      inviteMessage += `@${m.sender.split('@')[0]} te está invitando a unirse a este grupo\n\n`;
      inviteMessage += `*Link:* ${link}\n\n`;
      inviteMessage += global.set.footer;
      await sock.sendMessage(text + '@s.whatsapp.net', {
        text: inviteMessage,
        mentions: [m.sender]
      });
      m.reply('Se ha enviado el enlace de invitación al usuario ✅');

    } catch (error) {
      console.error('Error al enviar invitación:', error);
      m.reply(global.status.error);
    }
  }
};