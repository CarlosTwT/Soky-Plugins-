export default {
  name: 'add',
  tags: 'group',
  command: ['add', 'addmem'],
  description: 'Agregar miembros al grupo',
  example: '',
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock, text, participants }) => {
    try {
      let who = m.quoted ? m.quoted.sender : m.mentions && m.mentions[0] ? m.mentions[0] : m.text ? (m.text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
      if (!who || who == m.sender) return m.reply('*Cita/etiqueta* a quien que deseas agregar!!')
      if (m.metadata.participants.filter(v => v.id == who).length == 0) return m.reply(`El objetivo no está en un grupo !`)
      let data = await sock.groupParticipantsUpdate(m.chat, [who], 'remove')
      m.reply(func.format(data))
    } catch (e) {
      console.log(e)
      m.reply(global.status.error)
    }
  }
}