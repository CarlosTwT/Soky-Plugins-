export default {
  name: 'scipt',
  tags: 'info',
  command: ['sc', 'script', 'buysc'],
  description: 'Deseas comprar este script?',
  example: '',
  run: async(m, { sock, text, command }) => {
    let teks = `*[ SOKY AI - SC ]*\n\n`
    teks += `*-* Este sc no está dispuesto al público general. Para obtener este script porfavor contáctate con mi owner.\n`
    teks += `*-* Características generales:\n`
    teks += `*-* No botones\n*-* Rápido y fluido\n*-* Anti Ban\n*-* Simple\n*-* Eficiente\n*-* Actualizado siempre.\n`
    teks += global.set.footer
    sock.sendFThumb(m.chat, global.set.wm, teks, "https://tmpfiles.org/dl/14254231/tmp.jpg", global.media.swa, m)
  }
}