export default {
  name: 'unbanchat',
  tags: 'owner',
  command: ['unbanchat'],
  description: 'Desbanear el chat en el grupo',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    m.reply("*Éxito* Chat desbaneado")
	db.chats[m.chat].isBanned = false
  } 
}