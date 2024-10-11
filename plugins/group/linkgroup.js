export default {
  name: 'linkgroup',
  tags: 'group',
  command: ['linkgroup', 'linkgc', 'link'],
  description: 'Tome el enlace del grupo y compártalo con los miembros.',
  example: '',
  group: true,
  botAdmin: true,
  run: async(m, { sock }) => {
    m.reply("https://chat.whatsapp.com/" + await sock.groupInviteCode(m.chat))
  }
}