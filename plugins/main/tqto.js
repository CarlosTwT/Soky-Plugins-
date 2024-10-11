export default {
  name: 'Creditos',
  tags: 'main',
  command: ['tqto', 'creditos', 'Agradecimientos'],
  description: 'Créditos de desarrollador',
  example: '',
  run: async(m, { sock, text, command }) => {
    let teks = `*[ Gracias a ]*\n\n`
    teks += `*-* AlisaDev & Irull2nd (Base Maker)\n`
    teks += `*-* Dims\n`
    teks += `*-* CarlosTwT\n`
    teks += global.set.footer
    m.reply(teks)
  }
}