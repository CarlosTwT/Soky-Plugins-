export default {
  name: 'deletecmd',
  tags: 'owner',
  command: ['delcommand', 'df', 'dp'],
  description: 'Eliminar funciones del directorio de comandos',
  example: Func.example('%p', '%cmd', 'plugins/owner/add.js'),
  owner: true,
  run: async(m, { text }) => {
    //let plugin = Object.keys(plugins).map(v => v.replace(/.js/g, "").split("command/")[1])
    if (!plugin.includes(text)) return m.reply("Folder not found")
    func.fs.unlinkSync(text)
    m.reply("Plugin files " + text + " was removed")
  }
}