export default {
  name: 'runtime',
  tags: 'info',
  command: ['runtime', 'rt'],
  description: 'Tiempo de ejecución o tiempo de actividad del bot',
  example: '',
  run: async(m) => {
    m.reply(await func.runtime(process.uptime()))
  }
}