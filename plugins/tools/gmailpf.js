import { gmailProfile } from '../../storage/script/gmailprof.js';

export default {
  name: 'gmailcheck',
  tags: 'tools',
  command: ['gmailcheck', 'checkgmail'],
  description: 'Verifica información de un perfil de Gmail',
  example: Func.example('%p', '%cmd', 'ejemplo@gmail.com'),
  limit: false,
  run: async(m, { sock, text }) => {
    if (!text) return m.reply(`Ingresa una dirección de correo de Gmail\nEjemplo: ${m.prefix}gmailcheck ejemplo@gmail.com`);
    
    if (!text.endsWith('@gmail.com')) return m.reply('Por favor, ingresa una dirección de correo de Gmail válida.');

    try {
      m.reply(global.status.wait);
      const result = await gmailProfile.check(text);
      
      let message = `*Información del perfil de Gmail*\n\n`;
      message += `📧 *Email:* ${result.email}\n`;
      message += `🖼️ *Foto de perfil:* ${result.photoProfile}\n`;
      message += `🕒 *Última edición del perfil:* ${result.lastEditProfile}\n`;
      message += `🆔 *Google ID:* ${result.googleID}\n`;
      message += `👤 *Tipos de usuario:* ${result.userTypes}\n`;
      message += `💬 *Google Chat: *\n`;
      message += `   - Tipo de entidad: ${result.googleChat.entityType}\n`;
      message += `   - ID de cliente: ${result.googleChat.customerID}\n`;
      message += `🌐 *Google Plus:*\n`;
      message += `   - Usuario empresarial: ${result.googlePlus.enterpriseUser}\n`;
      message += `🗺️ *Datos de Maps:*\n`;
      message += `   - Página de perfil: ${result.mapsData.profilePage}\n`;
      message += `🔒 *Estado IP:* ${result.ipAddress}\n`;
      message += `📅 *Calendario público:* ${result.calendar}\n`;

      if (result.photoProfile !== 'Nothing' && result.photoProfile !== 'Not found.') {
        await sock.sendMessage(m.chat, {
          image: { url: result.photoProfile },
          caption: message
        }, { quoted: m });
      } else {
        m.reply(message);
      }
      
    } catch (error) {
      console.error(error);
      m.reply('Ocurrió un error al verificar el perfil de Gmail. Por favor, intenta de nuevo más tarde...');
    }
  }
};
