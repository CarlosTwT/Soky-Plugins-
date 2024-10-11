export default {
  name: 'self/public',
  tags: 'owner',
  command: ['self', 'public'],
  description: 'Cambiar el modo bot a público y propio',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    if (command == "self") {
      m.reply("El robot cambia a *Self* mode")
      global.db.settings.self = true
	} else if (command == "public") {
      m.reply("El robot cambia a *Public* mode")
      global.db.settings.self = false
    } 
  }
}