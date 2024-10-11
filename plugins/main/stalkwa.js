import moment from "moment-timezone";
import PhoneNum from "awesome-phonenumber";
let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
export default {
name: 'wastalk',
tags: 'main',
command: ['wastalk', 'stalknum', 'numbstalk'],
description: 'stalkear número de WhatsApp',
example: '',
run: async (m, { sock, command, text, args }) => {
try {
let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
if (!num) throw `*• Ejemplo :* ${m.prefix + command} *[Número]*`;
num = num.replace(/\D/g, '') + '@s.whatsapp.net';
if (!(await sock.onWhatsApp(num))[0]?.exists) throw 'El número no está registrado en la aplicación WhatsApp. !';
let img = await sock.profilePictureUrl(num, 'image') || false;
let bio = await sock.fetchStatus(num).catch(_ => {});
let name = await sock.getName(num);
let business = await sock.getBusinessProfile(num);
let format = PhoneNum(`+${num.split('@')[0]}`);
let country = regionNames.of(format.getRegionCode('international'));
let wea = `*[ WhatsApp Stalk ]*\n\n*° Country :* ${country.toUpperCase()}\n*° Nombre :* ${name ? name : '-'}\n*° Formato de número :* ${format.getNumber('international')}\n*° Url Api :* wa.me/${num.split('@')[0]}\n*° Menciones :* @${num.split('@')[0]}\n*° Biografía :* ${bio?.status || '-'}\n*° última actualización:* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('id').format('LL') : '-'}\n\n${business ? `*[ WhatsApp Business Stalk ]*\n\n*° BusinessId :* ${business.wid}\n*° Website :* ${business.website ? business.website : '-'}\n*° Email :* ${business.email ? business.email : '-'}\n*° Category :* ${business.category}\n*° Address :* ${business.address ? business.address : '-'}\n*° Timeone :* ${business.business_hours.timezone ? business.business_hours.timezone : '-'}\n*° Descripción* : ${business.description ? business.description : '-'}` : '*Cuenta estándar de WhatsApp*'}`
img ? await sock.sendMessage(m.chat, {
image: {
url: img
},
caption: wea,
mentions: [num]
}, {
quoted: m
}) : m.reply(wea);
} catch (err) {
m.reply(`lo siento, ocurrió un error`);
}
}
}