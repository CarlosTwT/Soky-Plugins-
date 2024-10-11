const isToxic = /(puto|negro|pendejo|mamaguevo|verga|gay|gei|castroso|putita|grone|maldito|infinepe|idiota|meco|maricon|cabrón|cabro|hpt|hdpt|crvrg|mmvrg|mmv|gei|das asco|maricooon|tu madre)/i;

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1
    let chat = global.db.chats[m.chat]
    let bot = global.db.settings || {}
    let isAntiToxic = isToxic.exec(m.text)
      if (chat.antitoxic && isAntiToxic) {
        m.reply(`*Se detectó un insulto*`)
          if (isBotAdmin && bot.restrict) {
            return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
          } else if (!bot.restrict) return m.reply('La próxima vez no seas así.!')
        }
   return !0
}