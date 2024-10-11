export default {
  name: 'setmenu',
  tags: 'owner',
  command: ['setmenu'],
  description: 'Cambiar el tipo de menú del bot',
  example: '',
  owner: true,
  run: async(m, { sock, text, args, command }) => {
    try {
      if (!args[0]) return m.reply(Func.example(m.prefix, command, '2'))
      if (!['1', '2', '3'].includes(args[0])) return m.reply('Estilo no disponible!')
      sock.reply(m.chat, `Utilice estilos con éxito *${args[0]}*.`, m).then(() => db.settings.style = parseInt(args[0]))
    } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
    }
  }
}