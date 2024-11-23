import fs from 'fs';

export default {
  name: 'groupcontacts',
  tags: 'group',
  command: ['groupcontacts', 'gccontacts'],
  description: 'Genera un archivo VCF con los contactos del grupo',
  group: true,
  run: async(m, { sock }) => {
    try {
      let gcdata = await sock.groupMetadata(m.chat);
      
      if (!gcdata || !gcdata.participants) {
        return m.reply('No se pudo obtener la información del grupo.');
      }

      let vcard = '';
      let noPort = 0;

      for (let participant of gcdata.participants) {
        vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${participant.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${participant.id.split("@")[0]}:+${participant.id.split("@")[0]}\nEND:VCARD\n`;
      }

      let cont = './contacts.vcf';

      await m.reply(`Un momento, estoy compilando ${gcdata.participants.length} contactos en un archivo vcf...`);

      await fs.promises.writeFile(cont, vcard.trim());

      await sock.sendMessage(m.chat, {
        document: await fs.promises.readFile(cont),
        mimetype: 'text/vcard',
        fileName: 'Group contacts.vcf',
        caption: `VCF para ${gcdata.subject}\n${gcdata.participants.length} contactos`
      }, { quoted: m });

      await fs.promises.unlink(cont);
    } catch (e) {
      console.error(e);
      m.reply('Ocurrió un error al procesar la solicitud.');
    }
  }
};