export default {
  name: 'waifu',
  tags: 'tools',
  command: ["waifu"],
  description: 'te gusta lo raro',
  example: '',
  limit: false,
    run: async (m, { sock, command }) => {
        let data = await Func.fetchJson("https://api.waifu.pics/sfw/waifu");
        await sock.sendMessage(m.chat, {
            image: {
                url: data.url
            },
            caption: `*[ ${command} Random ]*`
        }, {
            quoted: m
        })
    }
}
