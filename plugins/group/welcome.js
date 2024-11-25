import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';

export default {
  name: 'welcome',
  tags: 'group',
  command: ['welcome'],
  description: 'Bienvenida/despedida en un grupo',
  example: 'ejemplo: welcome >on/off>',
  owner: false,
  group: true,
  botAdmin: true,
  run: async(m, { text}) => {
    const dbPath = path.join(__dirname, '..', '..', 'storage', 'database', 'welcome.json')
    const db = JSON.parse(fs.readFileSync(dbPath));
    
    switch (text) {

      case 'on': {
        if(db.includes(m.chat)) {
          return m.reply('El welcome ya esta activado en el grupo...');
        }
        db.push(m.chat);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        return m.reply('Welcome activado...')
      }

      case 'off': {
        if(!db.includes(m.chat)) {
          return m.reply('El welcome no esta activado en el grupo...');
        }
        const index = db.indexOf(m.chat);

        if(index !== -1) {
          db.splice(index, 1);
          fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
          return m.reply('Welcome desactivado...')
        }

        return m.reply('Error, intentelo de nuevo...');
      }

      default: 

        m.reply('Accion incorrecta. Ejemplo: /welcome on/off');

    }

  }
}