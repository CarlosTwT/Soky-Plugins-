export default {
  name: 'hidetag',
  tags: 'group',
  command: ['hidetag', 'h', 'everyone'],
  description: 'Etiqueta a todos los miembros del grupo.',
  example: Func.example('%p', '%cmd', 'Hola'),
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock, text, participants }) => {
    sock.sendMessage(m.chat, { text: text, mentions: m.metadata.participants.map(a => a.id) }, { quoted: null })
  }
}