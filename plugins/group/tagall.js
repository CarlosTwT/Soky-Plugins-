export default {
  name: 'tagall',
  tags: ['group'],
  command: ['tagall'],
  description: 'Etiqueta a todos los miembros del grupo',
 example: Func.example('%p', '%cmd', 'texto'),
  group: true,
  admin: true,
  botAdmin: true,
  run: async (m, { sock, args, text }) => {
    try {
      const groupMetadata = m.isGroup ? await sock.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : []
      
      let teks = `*[ Tag All ]*\n\nSolicitado por: @${m.sender.split('@')[0]}\n\n`
      if (text) teks += `Mensaje: ${text}\n\n`
      
      for (let mem of participants) {
        teks += `• @${mem.id.split('@')[0]}\n`
      }

      await sock.sendMessage(m.chat, { 
        text: teks, 
        mentions: participants.map(a => a.id)
      }, { quoted: m })
    } catch (error) {
      console.error('Error en el comando tagall:', error)
      m.reply('Ocurrió un error al ejecutar el comando.')
    }
  }
}