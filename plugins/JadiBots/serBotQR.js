import { serBotQR } from "../../storage/serBot/serBotQR.js"

export default {
  name: 'SerBot QR',
  tags: 'JadiBots',
  command: ['serbot', 'serbotqr'],
  description: 'Conviertete en un subBot de SOCK AI',
  limit: true,
  run: async(m, { sock, args }) => {
    await serBotQR(m, sock)
    .catch(e => console.log(e))
    .then(e => console.log(e));
  }
}


