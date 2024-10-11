import { createHash } from "crypto"

export default {
  name: 'checarsn',
  tags: 'main',
  command: ['checarsn'],
  description: 'Mira tu número de serie.',
  example: '',
  register: true,
  run: async(m) => {
    let sn = createHash("md5").update(m.sender).digest("hex")
    m.reply(`*Serial number* : ${sn}`)
  }
}