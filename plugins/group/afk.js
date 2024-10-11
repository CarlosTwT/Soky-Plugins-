export default {
  name: 'afk',
  tags: 'group',
  command: ['afk'],
  description: 'Establece tu estado en afk',
  example: '',
  run: async (m, { sock, text, args }) => {
    let name = m.pushName || sock.getName(m.sender)
    let user = global.db.users[m.sender]
    user.afk = +new Date()
    user.afkReason = text || 'Sin razón'
    m.reply(`${name} actualmente AFK por la razón: ${text ? text : 'no tiene razón'}`)
  }
}