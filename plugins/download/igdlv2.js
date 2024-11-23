import axios from 'axios';

export default {
  name: 'instagram',
  tags: 'download',
  command: ['instagram', 'ig', 'igdl'],
  description: 'Descarga contenido de Instagram',
  example: Func.example('%p', '%cmd', 'https://www.instagram.com/reel/'),
  limit: false,
  run: async(m, { sock, args }) => {
    if (!args[0]) return m.reply(`Ingresa la URL de Instagram\nEjemplo: ${m.prefix}instagram https://www.instagram.com/reel/CvYLRDVx9cY/`);
    
    m.reply(global.status.wait);
    
    try {
      let result = await instagram(args[0]);
      if (!result.status) return m.reply(`Ocurrió un error al descargar el contenido: ${result.msg}`);
      
      for (let item of result.data) {
        if (item.type === 'image') {
          await sock.sendMessage(m.chat, { 
            image: { url: item.url },
            caption: 'by Soky'
          }, { quoted: m });
        } else if (item.type === 'video') {
          await sock.sendMessage(m.chat, { 
            video: { url: item.url },
            caption: 'by Soky'
          }, { quoted: m });
        }
      }
    } catch (error) {
      console.error(error);
      m.reply("Ocurrió un error al procesar la solicitud.");
    }
  }
};

async function instagram(url) {
  return new Promise(async (resolve, reject) => {
    if (!url.match(/\/(reel|reels|p|stories|tv|s)\/[a-zA-Z0-9_-]+/i)) {
      return reject({ status: false, creator: "Nzx", msg: "URL inválida" });
    }
    
    try {
      let jobId = await (await axios.post("https://app.publer.io/hooks/media", {
        url: url,
        iphone: false,
      }, {
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "es-ES,es;q=0.9",
          "Cache-Control": "no-cache",
          Origin: "https://publer.io",
          Pragma: "no-cache",
          Priority: "u=1, i",
          Referer: "https://publer.io/",
          "Sec-CH-UA": '"Chromium";v="128", "Not A Brand";v="24", "Google Chrome";v="128"',
          "Sec-CH-UA-Mobile": "?0",
          "Sec-CH-UA-Platform": "Windows",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        },
      })).data.job_id;
      
      let status = "working";
      let response;
      while (status !== "complete") {
        response = await axios.get(`https://app.publer.io/api/v1/job_status/${jobId}`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "es-ES,es;q=0.9",
            "Cache-Control": "no-cache",
            Origin: "https://publer.io",
            Pragma: "no-cache",
            Priority: "u=1, i",
            Referer: "https://publer.io/",
            "Sec-CH-UA": '"Chromium";v="128", "Not A Brand";v="24", "Google Chrome";v="128"',
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": "Windows",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          }
        });
        status = response.data.status;
      }
      
      let data = response.data.payload.map((item) => ({
        type: item.type === "photo" ? "image" : "video",
        url: item.path,
      }));
      
      resolve({ status: true, data });
    } catch (e) {
      reject({ status: false, msg: e.message });
    }
  });
}