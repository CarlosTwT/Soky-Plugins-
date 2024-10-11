import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

export default {
  name: 'register',
  tags: 'main',
  command: ['register','registrar', 'reg', 'daftar'],
  description: 'Regístrate para poder utilizar el bot',
  example: '',
  run: async(m, { sock, text, command }) => {
    let user = db.users[m.sender]
    let pp = await sock.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co.com/jwBzN73/110200520-p0.png')
    if (user.registered === true) return m.reply(`Ya estás registrado en la base de datos, ¿quieres volver a registrarte? Usar *${m.prefix}unreg*`)
    if (!Reg.test(text)) return m.reply(`Usar comandos *${m.prefix + command} (nombre).(edad)* | Ejemplo: *${m.prefix + command} ${m.pushName}.30* `)

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('El nombre no puede estar vacío')
    if (!age) return m.reply('La edad no puede estar vacía.')

    age = parseInt(age)
    if (age > 40) return m.reply('Vaya, viejo...')
    if (age < 5) return m.reply('Qué tonto')
    
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date()
    user.registered = true

    let sn = createHash('md5').update(m.sender).digest('hex')
    let teks = `*[ Tu información ]*\n\n`
    teks += `*-* *Nombre* : ${name}\n`
    teks += `*-* *Edad* : ${age} Años\n`
    teks += `*-* *Serial* : ${sn}\n\n`
    teks += global.set.footer
    m.reply(teks)
    
    let riyo = `*[ Notificaciones del sistema ]*\n\n`
    riyo += `*${m.pushName}* Se ha Registrado\n\n*-* *Nombre* : ${name}\n*-* *Edad* : ${age} Años\n*-* *Sn* : ${sn}\n\n`
    await sock.reply(global.media.scm, riyo, null)
  }
}