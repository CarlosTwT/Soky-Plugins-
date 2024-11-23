export default {
  name: 'add',
  tags: 'group',
  command: ['add', 'agregar'],
  description: 'Agregar un participante al grupo',
  example: Func.example('%p', '%cmd', '51999999999'),
  group: true,
  admin: false,
  botAdmin: true,
  run: async(m, { sock, text }) => {
    try {
      if (!text && !m.quoted) {
        return m.reply(`Ejemplo: ${m.prefix}add 51999999999`);
      }

      const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;

      // Verificar si el usuario ya está en el grupo
      const groupMetadata = await sock.groupMetadata(m.chat);
      const participants = groupMetadata.participants.map(v => v.id);
      if (participants.includes(numbersOnly)) {
        return m.reply('El usuario ya está en el grupo.');
      }

      // Intentar agregar al usuario
      const response = await sock.groupParticipantsUpdate(m.chat, [numbersOnly], 'add');
      
      // Verificar si el usuario fue agregado correctamente
      const updatedGroupMetadata = await sock.groupMetadata(m.chat);
      const updatedParticipants = updatedGroupMetadata.participants.map(v => v.id);
      
      if (updatedParticipants.includes(numbersOnly)) {
        m.reply('¡Usuario agregado con éxito!');
      } else {
        m.reply('No se pudo agregar al usuario. Puede que tenga configuración de privacidad que lo impide o haya otro problema.');
      }
    } catch (e) {
      console.error('Error al agregar usuario:', e);
      m.reply('Ocurrió un error al intentar agregar al usuario.');
    }
  }
};