import pkg, { DisconnectReason, fetchLatestWaWebVersion } from '@whiskeysockets/baileys';
const { baileys, makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore, makeInMemoryStore } = pkg;
import pino from 'pino';
import { Client, Serialize } from "../../system/lib/serialize.js";
import { loadPluginFiles } from "../../system/lib/plugins.js";
import qrcode from 'qrcode';
import helper from '../../system/lib/helper.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent', 
    stream: 'store',
  }),
});
const pluginFolder = helper.__dirname(join(__dirname, "../../plugins"));
const pluginFilter = (filename) => /\.js$/.test(filename);

export default {
  name: 'SerBot Code',
  tags: 'JadiBots',
  command: ['serbotcode', 'code'],
  description: 'Conviertete en un subBot de SOCK AI',
  example: Func.example('%p', '%cmd', '+524271859535'),
  limit: true,
  run: async(m, { sock, args, text }) => {

  if(!args) {
    return m.reply('*Ingresa tu numero de telefono*. Ejemplo: /serBotCode *+524271859535*\n\n> *Nota: Recuerca colocar tu numero con tu codigo de pais y sin espacios.*');
  }

  let phoneNumber = args[0];

  const serBotCode = async(phoneNumber) => {
    try {
      const { saveCreds, state} = await useMultiFileAuthState(`./storage/temp/jadibots/${phoneNumber}`);
  
      if (state.creds.accountSyncCounter != 0) {
        return m.reply('*No puedes ser sub-bot por que ya eres uno* 🥸');
      }
  
      let conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, 
        browser: ['Ubuntu', 'Chrome', '20.0.04'], 
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'fatal' }))
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
      });
      store.bind(conn.ev);
      conn = await Client(conn, store );
  
      loadPluginFiles(pluginFolder, pluginFilter, {
        logger: conn.logger,
        recursiveRead: true,
      });
  
      
      if (!conn.authState.creds.registered) {
        setTimeout(async () => {
          let pairingCode = await conn.requestPairingCode(phoneNumber);
          pairingCode = pairingCode.match(/.{1,4}/g)?.join('-');
          console.log(chalk.bgCyanBright(`[Pairing code generated for ${phoneNumber}: ${pairingCode}]`));
  
          const msg = m.reply(`*Utilize este Código \`${pairingCode}\` para convertirte en SockAi(sub-Bot). Sigue los siguientes pasos*\n\n1.Haga click en los tres puntitos ubicado en la esquina superior de lado derecho en el inicio de WhatsApp.\n2.Haga click en *Dispositivos Vinculados*\n3.Haga click en *Vincular un dispositivo*\n4.Click en *Vincular con el numero de telefono*\n5.Coloque el siguiente codigo: \`${pairingCode}\`\n`);
          setTimeout(async () => await sock.sendMessage(m.chat, { delete: msg.key }), 70000);
        }, 3000);
      }
      store.bind(conn.ev);
      
      
      conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
      
        if (lastDisconnect?.error) {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
          if (shouldReconnect) {
            await serBotCode(phoneNumber); 
          } else {
            console.error(lastDisconnect.error?.output?.statusCode);
          }
        }
      
        if (connection === 'open') {
          m.reply('*Has sido conectado exitosamente como sub-bot* 🥳');
        }
      
        if (connection === 'close') {
          await serBotCode(phoneNumber); 
        }
      });
      
      
      
      store.bind(conn.ev);
      conn.ev.on('creds.update', saveCreds);  
      conn.ev.on("contacts.update", (update) => {
        for (let contact of update) {
          let id = baileys.jidNormalizedUser(contact.id)
          if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
      });
  
      conn.ev.on("contacts.upsert", (update) => {
        for (let contact of update) {
          let id = baileys.jidNormalizedUser(contact.id);
          if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
        }
      });
  
  
      conn.ev.on("messages.upsert", async (message) => {
        if (!message.messages) return;
        const msg = await Serialize(conn, message.messages[0]);
        if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0)
        store.groupMetadata = await conn.groupFetchAllParticipating();
        await (await import(`./handler.js`)).handler(conn, msg, message);
      });
  
      conn.ev.on("group-participants.update", async (message) => {
      await (await import(`./handler.js?v=${Date.now()}`)).participantsUpdate(message.id, message.participants[0], message.action);
      });
  
      conn.ev.on("groups.update", async (update) => {
      await (await import(`./handler.js?v=${Date.now()}`)).groupsUpdate(update);
      });
  
      conn.ev.on("call", async (json) => {
      await (await import(`./handler.js?v=${Date.now()}`)).rejectCall(json);
      });
  
      conn.ev.on("presence.update", async (presenceUpdateEvent) => {
      try {
        await (await import(`./handler.js?v=${Date.now()}`)).presenceUpdate(presenceUpdateEvent);
      } catch (error) {
        console.error("Error handling presence update:", error);
      }
      });
  
    } catch (error) {
      console.error('Error starting subbot: ', error);
      m.reply('*Ocurrió un error al intentar conectarte como sub-bot :(*');  
    }
  }

  serBotCode(phoneNumber);

  

  }
}


