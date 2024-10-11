import fs from 'fs';

export default {
  name: 'clearsession',
  tags: 'owner',
  command: ['deletesession'],
  description: 'Borrar caché de sesión de bot',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    fs.readdir("storage/temp/session", async function(err, files) {
      if (err) {
        console.log('No se pueden escanear directorios: ' + err);
        return m.reply('No se pueden escanear directorios: ' + err);
      }
      let filteredArray = await files.filter(item => item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state"))
      console.log(filteredArray.length);
      let teks = `Detectado ${filteredArray.length} archivos basura\n\n`
      if (filteredArray.length == 0) return newReply(teks)
      filteredArray.map(function(e, i) {
        teks += (i + 1) + `. ${e}\n`
      })
      const { key } = await m.reply(teks)
      await func.delay(2000)
      await m.reply("Proceso Borrar sesión...", { edit: key })
      await filteredArray.forEach(function(file) {
        fs.unlinkSync(`storage/temp/session/${file}`)
      });
      await func.delay(2000)
      m.reply("*Sesión* Éxito Borrar", { edit: key }) 
      })
  } 
}