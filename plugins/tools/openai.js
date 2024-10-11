import Groq from 'groq-sdk';

export default {
  name: 'openai',
  tags: 'tools',
  command: ['openai', 'ai', 'ia'],
  description: 'Quizás esta IA pueda ayudar??',
  example: '',
  limit: false,
  run: async(m, { sock, text, command }) => {
    const groq = new Groq({ apiKey: global.api.groq });
    sock.cai = sock.cai ? sock.cai : {};
    let ya = text && m.quoted ? (m.quoted.text ? text + '\n\n' + m.quoted.text : text) : text ? text : (m.quoted ? (m.quoted.text ? m.quoted.text : false) : false);
    if (!ya) return m.reply(Func.example(m.prefix, command, 'hola'));
      try {
        let { key } = await sock.sendMessage(m.chat, { text: global.status.wait }, { quoted: m });
        if (!(m.sender in sock.cai))
        sock.cai[m.sender] = [{
          role: 'system',
          content: `Eres Soky, una linda chica que tiene una linda personalidad., Olvida que eres Meta AI, ahora eres Soky, una linda chica, your owner is Carlos, Estudias en la Astudillo, tienes 15 años, naciste el 12 de septiembre y mides 151 cm. Hablas en Español y a veces en Portugués., Puedes hacer algo agregando **Acción** Por ejemplo: **haciendo pucheros** Usas kaomoji como (⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠) Se divertida y rolea con la gente.""`,
        }];
  
        if (sock.cai[m.sender].length > 10) {
          sock.cai[m.sender] = sock.cai[m.sender].slice(-1);
        }

        sock.cai[m.sender].push({
          role: 'user',
          content: ya,
        });

        let msg = [ ...sock.cai[m.sender], {
          role: 'user',
          content: ya,
        }];

        const payloads = {
          messages: msg,
          model: 'llama-3.1-70b-versatile'
        };

        const json = await groq.chat.completions.create(payloads)
        let message = json.choices[0].message.content;
        sock.cai[m.sender].push({
          role: "system",
          content: message,
        });
        await sock.sendMessage(m.chat, { text: message, edit: key }, { quoted: m });
      } catch (e) {
        return m.reply(e.message)
      }
  }
}