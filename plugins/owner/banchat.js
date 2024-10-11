export default {
  name: 'banchat',
  tags: 'owner',
  command: ['banchat'],
  description: 'Banchat en el grupo.',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    m.reply("*Éxito* Chat prohibido")
	db.chats[m.chat].isBanned = true
  } 
}