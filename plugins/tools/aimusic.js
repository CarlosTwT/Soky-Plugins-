import fetch from "node-fetch";

export default {
  name: 'aimusic',
  tags: 'tools',
  command: ['aimusic'],
  description: 'Genera letras de música utilizando IA',
  example: Func.example('%p', '%cmd', 'Descripción de la canción'),
  run: async (m, { sock, args }) => {
    if (!args.length) return sock.reply(m.chat, `Por favor, usa el formato: aimusiclyrics [descripción]`, m);
    
    let inputText = args.join(" ");
    try {
      await m.reply(global.status.wait);
      let ress = await AimusicLyrics(inputText);
      if (!ress) return await sock.reply(m.chat, "No se pudo generar la letra.", m);
      
      await sock.reply(m.chat, `*LETRA GENERADA POR IA*\n\n> Título: ${inputText}\n- Letra:\n\`${ress}\``, m);
    } catch (e) {
      console.error('Error:', e);
      sock.reply(m.chat, 'Ocurrió un error al procesar tu solicitud.', m);
    }
  }
};

async function AimusicLyrics(prompt) {
  const url = "https://aimusic.one/api/v3/lyrics/generator";
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    "Referer": "https://aimusic.one/ai-lyrics-generator"
  };
  const data = {
    description: prompt,
    style: "Auto",
    topic: "Auto",
    mood: "Auto",
    lan: "auto",
    isPublic: true
  };
  
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    });
    let result = await response.json();
    return result.lyrics;
  } catch (e) {
    throw e;
  }
}