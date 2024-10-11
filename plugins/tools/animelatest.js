export default {
  name: 'animelatest',
  tags: 'tools',
  command: ['animelatest', 'animebaru'],
  description: 'Lista de animes en curso',
  example: '',
  limit: false,
  run: async(m, { sock }) => {
    try {
      let loli = await (await scrap.animeLatest()).anime
      let kecil = await scrap.animeLatest()
      if (loli.length == 0) return sock.reply(m.chat, Func.jsonFormat(yt), m)
      let teks = `*[ Anime ]*\n\n`
      loli.map((v, i) => {
        if (i < kecil.total) {
          teks += `*` + (i + 1) + `*. ` + v.title + '\n',
          teks += `*Episodio* : ` + v.episode + '\n',
          teks += `*Publicado por* : ` + v.postedBy + '\n',
          teks += `*Release* : ` + v.release + '\n',
          teks += `*Url* : ` + v.link,
          teks += `\n°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`
        }
      })
    sock.sendMedia(m.chat, loli[0].thumbnail, m, { caption: teks, mentions: [m.sender] })   
    } catch (e) {
      console.log(e)
      return conn.reply(m.chat, status.error, m)
    }
  }
}