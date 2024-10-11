/*  [ Info Command ]
 true = si
 false = no
 %cmd = prefix+command
 */

export default {
    name: 'toimg',
    tags: 'tools',
    command: ["toimg"], 
    description: 'Convertir sticker en imagen',
    run: async (m, { sock, command, args }) => {
        if (!m.quoted) throw `*• Ejemplo :* ${m.prefix + command} *[responde a un sticker]*`
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!/webp/.test(mime)) throw `*• Ejemplo :* ${m.prefix + command} *[responde a un sticker]*`
        let media = await q.download()
        await sock.sendMessage(m.chat, {
            image: media
        }, {
            quoted: m
        })
    }
}   