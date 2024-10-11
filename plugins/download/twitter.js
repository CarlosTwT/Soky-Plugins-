export default {
  name: 'twitter',
  tags: 'download',
  command: ['twitter', 'tw'],
  description: 'descarga videos de twitter',
  example: Func.example('%p', '%cmd', 'https://twitter.com/harusakinodoka/status/1781337062123458571?t=V1z23ry142zqnCWemS42CA&s=19'),
  limit: true,
  run: async(m, { sock, args }) => {
    if (!args[0].match('twitter.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        let anu = await Func.fetchJson(API(dlr, '/download/twitterv2', { url: args[0] }))
        if (!anu.status) return m.reply(global.status.fail)
        sock.sendMessage(m.chat, { video: { url: anu.data.media.url }, caption: `• *Fetching* : ${((new Date - old) * 1)} ms` },{ quoted: m })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}
//http://144.126.156.179/download/twitterv2?url=https://x.com/godmitzu/status/1818617471579934928