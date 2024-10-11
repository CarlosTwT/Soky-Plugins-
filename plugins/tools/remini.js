export default {
  name: 'remini',
  tags: 'tools',
  command: ['remini', 'hd', 'hdr'],
  description: 'Quizás esta función para HD en imágenes pueda ayudar??',
  example: '',
  limit: true,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Ummhh la foto??')
    if (!/image\/(jpe?g|png|webp)|application\/octet-stream/.test(mime)) return m.reply(`mime ${mime} no soportado`)
    let media = await q.download()
    m.reply("Wait...")
    let hade = await scrap.remini(media, "enhance")
	await sock.sendMessage(m.chat, { image: hade, caption: "by Soky" }, { quoted: m })
  }
}