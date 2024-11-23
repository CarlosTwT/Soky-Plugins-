export default {
  name: 'instagramv2',
  tags: 'download',
  command: ['instagramv2', 'igpost'],
  description: 'Descargar vídeos/imágenes de Instagram',
  example: Func.example('%p', '%cmd', 'https://www.instagram.com/reel/C8em8oaBWG4/?igsh=M20weThtamoxOWkw'),
  limit: false,
  run: async (m, { sock, args }) => {
    if (!args[0].match('instagram.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        const anu = await scrap.igDl(args[0])
        if (!anu.status) return m.reply(global.status.fail)
        sock.sendMessage(m.chat, { video: { url: anu.data[0].url }, caption: `• *Down* : ${((new Date - old) * 1)} ms` },{ quoted: m })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}