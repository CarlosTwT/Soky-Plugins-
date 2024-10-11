export default {
  name: 'whatanime',
  tags: 'tools',
  command: ['whatanime', 'wanime'],
  description: 'Puedes buscar anime cuyo título no conoces.',
  example: '',
  limit: false,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('No se encontraron medios')
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Mime ${mime} no soportado`)
    let media = await q.download()
    let nah = await Uploader.uploader(media)
    let res = await Func.fetchJson(`https://api.trace.moe/search?anilistInfo&url=${nah.data.url}`)
    let { id, idMal, title, synonyms, isAdult } = res.result[0].anilist
    let { filename, episode, similarity, video, image } = res.result[0]
    let mok = `*[ What Anime ]*\n\n*-* *Título :* ${title.romaji} (${title.native})\n*-* *Sinónimos :* ${synonyms}\n*-* *Adulto :* ${isAdult}\n*-* *similitud :* ${(similarity * 100).toFixed(1)}\n*-* *Episodio :* ${episode}\n\n${global.set.footer}`;
    await sock.sendMessage(m.chat, { image: { url: image }, caption: mok }, { quoted: m })
  }
}