import fetch from 'node-fetch';

export default {
  name: 'stalkchannel',
  tags: 'tools',
  command: ['channelwa', 'stalkchannel'],
  description: 'Puedes buscar info de canales de WhatsApp aquí.',
  limit: false,
  run: async(m, { sock, args, text }) => {
if (!text) return m.reply('Proporciona un enlace de canal de WhatsApp para stalkear');
if (!text.includes('whatsapp.com/channel')) {
        return m.reply(`No parece un enlace de canal. en WhatsApp, eh?`);
    }

const response = await fetch(`https://itzpire.com/stalk/whatsapp-channel?url=${text}`);

const data = await response.json()

const img = data.data.img;
const name = data.data.title

await sock.sendMessage(m.chat, { image: { url: img}, caption: `Nombre:- ${data.data.title}\n\nFollowers:- ${data.data.followers}\n\nDescripción:- ${data.data.description}`}, {quoted: m})
  }
}