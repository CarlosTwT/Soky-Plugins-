import { downloadFacebookVideo } from "../../storage/scarper/facebook.js"

export default {
  name: 'Facebook',
  tags: 'Download',
  command: ['facebook', 'fb'],
  description: 'Descarga vídeos de Facebook',
  example: Func.example('%p', '%cmd', 'https://www.facebook.com/100010929794713/posts/1885825845125057'),
  limit: true,
  run: async(m, { sock, args }) => {
    if (!args[0].match('facebook.com')) {
      return await m.reply(global.status.invalid);
    };
    await m.reply(global.status.wait);

    try {
      let old = new Date()
      const videoUrl = await downloadFacebookVideo(args[0]);
      await sock.sendMessage(m.chat, { video: { url: videoUrl }, caption: `• *Download* : ${((new Date - old) * 1)} ms Fb` },{ quoted: m })
    } catch (e) {
      console.log(e)
      return m.reply(global.status.error)
    }
  }
}


