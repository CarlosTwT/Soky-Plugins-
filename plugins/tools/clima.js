export default {
  name: 'clima',
  tags: 'info',
  command: ['clima'],
  description: 'Obtener información del clima de una ciudad',
  example: 'clima <nombre de la ciudad>',
  run: async (m, { sock, text }) => {
    try {
      if (!text) return m.reply('Por favor, escribe el nombre de la ciudad');

      let wdata = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=es`
      );

      let textw = `*🗺️ El clima en ${text}*\n\n`;
      textw += `*Clima:* ${wdata.data.weather[0].main}\n`;
      textw += `*Descripción:* ${wdata.data.weather[0].description}\n`;
      textw += `*Temperatura promedio:* ${wdata.data.main.temp}°C\n`;
      textw += `*Sensación térmica:* ${wdata.data.main.feels_like}°C\n`;
      textw += `*Presión:* ${wdata.data.main.pressure} hPa\n`;
      textw += `*Humedad:* ${wdata.data.main.humidity}%\n`;
      textw += `*Velocidad del viento:* ${wdata.data.wind.speed} m/s\n`;
      textw += `*Latitud:* ${wdata.data.coord.lat}\n`;
      textw += `*Longitud:* ${wdata.data.coord.lon}\n`;
      textw += `*País:* ${wdata.data.sys.country}\n`;

      await sock.sendMessage(m.chat, {
        text: textw,
      }, {
        quoted: m,
      });
    } catch (error) {
      console.error(error);
      m.reply('Lo siento, ha ocurrido un error al obtener la información del clima. Intenta usando solo el nombre de la ciudad.');
    }
  }
}