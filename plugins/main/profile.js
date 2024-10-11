export default {
  name: 'profile',
  tags: 'main',
  command: ['profile', 'me'],
  description: 'Ver tu tarjeta de perfil',
  example: '',
  register: true,
  run: async (m, { sock }) => {
    let user = db.users[m.sender]
    let teks = `*[ Profile ]*\n\n`
    teks += `*-* *Nombre* : ${user.name}\n`
    teks += `*-* *Edad* : ${user.age}\n`
    teks += `*-* *Exp* : ${user.exp}\n`
    teks += `*-* *Dinero* : ${user.money}\n`
    teks += `*-* *Nivel* : ${user.level}\n`
    teks += `*-* *Límite* : ${user.limit}\n`
    teks += `*-* *Estado* : ${user.premium ? 'Premium' : 'Free'}${user.premiumTime >= 1 ? '\n*-* *Expired* : ' + clockString(user.premiumTime - Date.now()) : ''}\n`
    teks += `*-* *Registrado?* : Yes\n`
    teks += `*-* *Hora de registro* : ${func.jam(user.regTime, { timeZone: 'Asia/Jakarta' })}, ${func.tanggal(user.regTime, 'Asia/Jakarta')}\n\n`
    teks += global.set.footer
    m.reply(teks)
  }
}

function clockString(ms) {
  let d = isNaN(ms) ? '' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '' : Math.floor(ms / 1000) % 60
  return [d, " Day ", h, " O'clock ", m, " Minute ", s, " Second"].map(v => v.toString().padStart(2, 0)).join("")
}