export default {
  name: 'resetlink',
  tags: 'group',
  command: ['revoke', 'resetlink', 'anularlink'],
  description: 'Restablece el enlace de invitación del grupo',
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock }) => {
    try {
      let revoke = await sock.groupRevokeInvite(m.chat);
      let newLink = 'https://chat.whatsapp.com/' + revoke;
      
      let teks = `*[ LINK DEL GRUPO RESTABLECIDO ]*\n\n`;
      teks += `• *Nuevo enlace* : ${newLink}\n`;
      teks += `• *Acción* : Restablecido por administrador\n\n`;
      teks += global.set.footer;

      await sock.sendMessage(m.chat, { 
        text: teks
      }, { quoted: m });
    } catch (error) {
      console.error('Error al restablecer el enlace del grupo:', error);
      m.reply(global.status.error);
    }
  }
};