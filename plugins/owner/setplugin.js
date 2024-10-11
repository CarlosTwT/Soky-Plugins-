export default {
  name: 'savefitur',
  tags: 'owner',
  command: ['savefitur', 'sf', 'sp'],
  description: 'Guardar funciones del directorio de comandos',
  example: Func.example('%p', '%cmd', 'plugins/owner/add.js'),
  owner: true,
  quoted: true,
  run: async(m, { text }) => {
    text = text.endsWith(".js") ? text.split(".js")[0] : text
    func.fs.writeFileSync(text + ".js", m.quoted.body)
    m.reply("Plugin files " + text + " ha sido salvado")
  }
}