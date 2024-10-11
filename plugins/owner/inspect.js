export default {
  name: 'inspect',
  tags: 'owner',
  command: ['inspect', 'ip'],
  description: 'Inspeccionar media newsletter de canal',
  example: '',
  owner: false,
  run: async (m, { store }) => {
    const data = m.isQuoted ? m.quoted : m
    if (!data) return m.reply('Responder mensajes!');
    const res = global.store.messages[m.chat].array.find(m => m.key.id === data.key.id)
    m.reply(JSON.stringify(res, null, 2))
  }
}