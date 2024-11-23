export default {
    name: 'sswebpdf',
    tags: 'tools',
    command: ['sswebpdf', 'webpdf', 'pdfweb'],
    description: 'Captura una página web en formato PDF',
    example: Func.example('%p', '%cmd', 'https://google.com'),
    limit: false,
    run: async(m, { sock, text }) => {
        if (!text) return m.reply(`Por favor, proporciona una URL\nEjemplo: .sswebpdf https://google.com`)

        if (!text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi)) {
            return m.reply('⚠️ Por favor, ingresa una URL válida')
        }

        try {
            m.reply(global.status.wait)

            const apiUrl = `https://deliriussapi-oficial.vercel.app/tools/sswebpdf?url=${encodeURIComponent(text)}`

            await sock.sendMessage(m.chat, {
                document: {
                    url: apiUrl
                },
                fileName: `WebCapture.pdf`,
                mimetype: 'application/pdf',
                caption: `🌐 Captura de: ${text}\n\n_by Soky AI_`
            }, { quoted: m })

        } catch (error) {
            console.error(error)
            m.reply('Ocurrió un error al generar el PDF. Por favor, verifica la URL e intenta de nuevo.')
        }
    }
}