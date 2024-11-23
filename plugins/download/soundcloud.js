import axios from "axios";

export default {
    name: 'soundcloud',
    tags: 'download',
    command: ['soundcloud', 'cover'],
    description: 'Descarga música de SoundCloud',
    example: Func.example('%p', '%cmd', 'dear god'),
    limit: false,
    run: async(m, { sock, text }) => {
        if (!text) return m.reply('Por favor, proporciona el nombre de la canción o el artista.')

        try {
            // Realizar la búsqueda en SoundCloud
            const searchResponse = await axios.get("https://deliriussapi-oficial.vercel.app" + "/search/soundcloud", {
                params: {
                    q: text,
                    limit: 1
                },
            });

            const shdata = searchResponse.data.data[0];

            // Realizar la descarga del audio
            const downloadResponse = await axios.get("https://deliriussapi-oficial.vercel.app" + "/download/soundcloud", {
                params: {
                    url: shdata.link,
                },
            });

            const downloadres = downloadResponse.data.data;

            // Formatear la información del audio
            const soundcloudt = `*S O U N D C L O U D*\n
*› Titulo :* ${downloadres.title || "-"}
*› Artista:* ${downloadres.author.username || "-"}
*› Id :* ${downloadres.author.id || "-"}
*› Followers :* ${downloadres.author.followers_count || "-"}
*› Likes :* ${downloadres.author.likes_count || "-"}
*› Publicado :* ${new Date(downloadres.author.created_at).toLocaleDateString() || "-"}`;

            // Obtener la imagen
            const imgxd = downloadres.imageURL.replace("t500x500", "t1080x1080") || downloadres.imageURL;
           await sock.sendFThumb(m.chat, global.set.wm, soundcloudt, imgxd, shdata.link, m);

            // Enviar el audio
            await sock.sendMessage(
                m.chat,
                {
                    audio: { url: downloadres.url },
                    fileName: `${downloadres.title}.mp3`,
                    mimetype: "audio/mpeg",
                },
                { quoted: m }
            );
        } catch (error) {
            console.error(error);
            m.reply('Ocurrió un error al procesar la solicitud.')
        }
    }
}