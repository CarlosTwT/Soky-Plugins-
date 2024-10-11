export default {
  name: 'onautoread/offautoread',
  tags: 'owner',
  command: ['onautoread', 'offautoread'],
  description: 'Habilitar lectura automática para este bot',
  example: '',
  owner: true,
  run: async(m, { sock, args, command }) => {
    if (command == 'onautoread') {
      m.reply('La lectura automática está activa')
      global.db.settings.autoread = true
    } else if (command == 'offautoread') {
      m.reply('La lectura automática está deshabilitada')
      global.db.settings.autoread = false
    } 
  }
}