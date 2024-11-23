export default {
    name: 'apk',
    tags: 'download',
    command: ['apk', 'playstore', 'app'],
    description: 'Descarga aplicaciones de Android',
    example: Func.example('%p', '%cmd', 'WhatsApp'),
    limit: false,
    run: async(m, { sock, text }) => {
        if (!text) return m.reply('Por favor, proporciona el nombre de una aplicación')
        
        try {
            m.reply(global.status.wait)
            
            const response = await fetch(`https://deliriussapi-oficial.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
            const json = await response.json();
            
            if (!json.status) return m.reply('No se encontró la aplicación')
            
            const { data } = json;

            let caption = `*📱 APK DOWNLOADER*\n\n`
            caption += `*• Nombre:* ${data.name}\n`
            caption += `*• Desarrollador:* ${data.developer}\n`
            caption += `*• Tamaño:* ${data.size}\n`
            caption += `*• ID:* ${data.id}\n`
            caption += `*• Publicado:* ${data.publish}\n\n`
            caption += `*📊 Estadísticas*\n`
            caption += `*• Descargas:* ${data.stats.downloads.toLocaleString()}\n`
            caption += `*• Calificación:* ⭐ ${data.stats.rating.average} (${data.stats.rating.total} votos)\n\n`
            caption += `*🏪 Tienda:* ${data.store.name}\n\n`
            caption += `_Descargando aplicación, espere..._`

            await sock.sendFThumb(m.chat, global.set.wm, caption, data.image, data.download, m);

            // Verificar tamaño
            if (data.sizeByte > 524288000) { // Si es mayor a 500MB
                return sock.sendMessage(m.chat, {
                    text: `⚠️ El archivo es demasiado grande (${data.size})\n` +
                         `Descárgalo directamente desde aquí:\n${data.download}`
                }, { quoted: m })
            }

            await sock.sendMessage(m.chat, {
                document: {
                    url: data.download
                },
                fileName: `${data.name}.apk`,
                mimetype: 'application/vnd.android.package-archive'
            }, { quoted: m })

        } catch (error) {
            console.error(error)
            m.reply('Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo.')
        }
    }
}