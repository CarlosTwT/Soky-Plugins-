import { promisify } from "util"
import cp, { exec as _exec } from "child_process"

export default {
  name: 'backup',
  tags: 'owner',
  command: ['backup'],
  description: 'Copia de seguridad de archivos',
  example: '',
  owner: true,
  private: true,
  run: async(m, { sock }) => {
    let exec = promisify(_exec).bind(cp)
    let { stdout } = await exec("zip -r storage/backup.zip * -x 'node_modules/*'")
    if (stdout) sock.sendMessage(m.chat, { document: await func.fs.readFileSync("./storage/backup.zip"), fileName: "backup-script.zip", mimetype: "application/zip", caption: "Se realizó una copia de seguridad exitosa del script" }, { quoted: m })
    func.fs.unlinkSync("./storage/backup.zip")
  }
}