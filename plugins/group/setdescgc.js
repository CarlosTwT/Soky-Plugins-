export default {
  name: 'setdescgc',
  tags: 'group',
  command: ['setdescgc', 'setdescriptiongroup'],
  description: 'Establece la descripción del grupo',
  example: Func.example('%p', '%cmd', 'texto'),
  group: true,
  admin: true,
  botAdmin: true,
  run: async (m, { sock, text }) => {
    if (text) {
      await sock.groupUpdateDescription(m.chat, text);
      m.reply(`La descripción del grupo ha sido cambiada a: ${text}`);
    } else {
      m.reply(`Por favor, ingresa la nueva descripción del grupo. Ejemplo: %prefix%command Reglas del grupo`);
    }
  }
}