import fetch from "node-fetch";

export default {
  name: 'translate',
  tags: 'tools',
  command: ['translate', 'traducir', 'trad'],
  description: 'Traduce texto a un idioma específico.',
  example: 'Ejemplo: .translate es Hello World',
  limit: false,
  group: true,

  run: async (m, { sock, args }) => {
    let lang, text;

    if (args.length >= 2) {
      lang = args[0] ? args[0] : "id";
      text = args.slice(1).join(" ");
    } else if (m.quoted && m.quoted.text) {
      lang = args[0] ? args[0] : "es";
      text = m.quoted.text;
    } else {
      return sock.sendMessage(m.chat, { text: `*Ejemplo: ${m.prefix + 'translate'} es Hello World*` });
    }

    try {
      const prompt = encodeURIComponent(text);
      let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${prompt}`);
      let result = await res.json();
      
      let lister = Object.keys(await langList());
      if (!lister.includes(lang)) {
        return sock.sendMessage(m.chat, { text: `El idioma *${lang}* no es válido. Consulta la lista de idiomas admitidos: https://cloud.google.com/translate/docs/languages` });
      }

      let caption = `${result[0][0][0]}`;  // Texto traducido
      await sock.sendMessage(m.chat, { text: caption });

    } catch (e) {
      console.log(e);
      await sock.sendMessage(m.chat, { text: 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.' });
    }
  }
};

async function langList() {
  let data = await fetch("https://translate.google.com/translate_a/l?client=webapp&sl=auto&tl=en&v=1.0&hl=en&pv=1&tk=&source=bh&ssel=0&tsel=0&kc=1&tk=626515.626515&q=")
      .then((response) => response.json());
  return data.tl;
}