export default {
    name: 'tiktokstalk',
    tags: 'info',
    command: ['tiktokstalk', 'ttstalk'],
    description: 'Obtener información de un perfil de TikTok',
    example: Func.example('%p', '%cmd', 'twice_tiktok_official'),
    limit: true,
    run: async(m, { sock, text }) => {
        if (!text) return m.reply(`Ingresa un nombre de usuario`)
        
        try {
            m.reply(global.status.wait)
            
            const apiUrl = `https://deliriussapi-oficial.vercel.app/tools/tiktokstalk?q=${encodeURIComponent(text)}`
            const response = await fetch(apiUrl)
            const json = await response.json()
            
            if (!json.status) return m.reply('Usuario no encontrado')
            
            const user = json.result.users
            const stats = json.result.stats
            
            let caption = `乂  *TIKTOK STALKER*\n\n`
            caption += `	◦  *Username* : ${user.username}\n`
            caption += `	◦  *Nickname* : ${user.nickname}\n`
            caption += `	◦  *Verificado* : ${user.verified ? '✅' : '❌'}\n`
            caption += `	◦  *Privado* : ${user.privateAccount ? '✅' : '❌'}\n`
            caption += `	◦  *Seguidores* : ${stats.followerCount}\n`
            caption += `	◦  *Siguiendo* : ${stats.followingCount}\n`
            caption += `	◦  *Total Likes* : ${stats.heartCount}\n`
            caption += `	◦  *Videos* : ${stats.videoCount}\n`
            caption += `	◦  *Región* : ${user.region}\n`
            caption += `	◦  *Bio* : ${user.signature}\n`
            caption += `	◦  *Link* : ${user.url}\n\n`
            caption += global.set.footer

            await sock.sendMessage(m.chat, { 
                image: { url: user.avatarLarger },
                caption: caption
            }, { quoted: m })
            
        } catch (error) {
            console.error(error)
            m.reply('Error al obtener información del usuario')
        }
    }
}