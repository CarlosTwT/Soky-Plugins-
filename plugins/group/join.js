const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))

export default {
  name: 'join',
  tags: 'group',
  command: ['join'],
  description: 'unirme a un grupo',
  example: '',
  owner: true,
  run: async(m, { sock, text, isAdmin, isBotAdmin }) => {
    try {
      let [_, code] = text.match(/chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i) || []
      if (!code) return m.reply('Link invalido');
      let res = await sock.groupAcceptInvite(code)
      m.reply(`Grupo unido exitosamente`)
    } catch (e) {
      return m.reply(global.status.error)
    }
  }
}