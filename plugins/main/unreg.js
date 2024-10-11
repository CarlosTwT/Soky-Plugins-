import { createHash } from 'crypto'

export default {
  name: 'unregister',
  tags: 'main',
  command: ['unregister', 'unreg', 'unregistrar'],
  description: 'Eliminar su cuenta en la base de datos del bot',
  example: Func.example('%p', '%cmd', 'tu número de serie'),
  register: true,
  run: async(m, { args }) => {
    let user = db.users[m.sender]
    let sn = createHash('md5').update(m.sender).digest('hex')
    if (args[0] !== sn) return m.reply('Número de serie incorrecto, verifique su número de serie escribiendo *.checksn*')
      m.reply('La cancelación del registro fue exitosa, ahora sus datos han sido eliminados')
      user.age = 0
      user.name = ''
      user.regTime = -1
      user.registered = false
  }
}