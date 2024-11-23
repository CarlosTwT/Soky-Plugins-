import yts from 'yt-search';

export default {
    name: 'yts',
    tags: 'search',
    command: ['yts', 'ytsearch'],
    description: 'Busca videos en YouTube',
    example: Func.example('%p', '%cmd', 'Despacito'),
    limit: true,
    run: async (m, { sock, text }) => {
        if (!text) return m.reply('Por favor, proporciona un término de búsqueda.');

        try {
            const results = await yts(text);
            if (!results.videos.length) return m.reply('No se encontraron videos para la búsqueda proporcionada.');

            let message = '*Resultados de búsqueda en YouTube:*\n\n';
            results.videos.slice(0, 20).forEach((video, index) => {
                message += `${index + 1}. *${video.title}*\n`;
                message += `   Canal: ${video.author.name}\n`;
                message += `   Duración: ${video.duration.timestamp}\n`;
                message += `   Vistas: ${formatNumber(video.views)}\n`;
                message += `   Subido: ${video.ago}\n`;
                message += `   Link: ${video.url}\n\n`;
            });

            message += `Mostrando los primeros 20 resultados para "${text}"\n`;
            message += 'Para ver el video, haz clic en el enlace o usa el comando de descarga.\n';

            await sock.sendMessage(m.chat, { text: message }, { quoted: m });
        } catch (error) {
            console.error(error);
            m.reply(global.status.error);
        }
    }
};

function formatNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
}