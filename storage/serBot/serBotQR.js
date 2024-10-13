import pkg from '@whiskeysockets/baileys';
const { baileys, makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, Browsers, makeCacheableSignalKeyStore, makeInMemoryStore } = pkg;
import pino from 'pino';
import { Client, Serialize } from "../../system/lib/serialize.js";
import { loadPluginFiles } from "../../system/lib/plugins.js";
import qrcode from 'qrcode';
import helper from '../../system/lib/helper.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

export const serBotQR = async(m, sock) => {
  try {
    const { saveCreds, state} = await useMultiFileAuthState(`./storage/temp/jadibots/${m.sender + Date.now()}`);
    const { version } = await fetchLatestBaileysVersion();

    if (state.creds.accountSyncCounter != 0) {
      return m.reply('*No puedes ser sub-bot por que ya eres uno* 🥸');
    }

    let conn = makeWASocket({
      logger: pino({ level: 'silent' }), // Nivel del log.
      browser: Browsers.macOS('Desktop'), // Informacion del navegador
      auth: {
        creds: state.creds, // Cargar credenciales almacenadas para autenticación.
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }).child({ level: 'fatal' })), // Cacheable signal key store
      },
      version: version, // Versión de WhatsApp
      printQRInTerminal: false, // Mostrar QR en la terminal.
      qrTimeout: 0, // Generar un QR despues si se vence el anterior.
      retryRequestDelayMs: 1000 * 5, // Si la conexion falla reintentar conectarse despues de 5 segundos.
      keepAliveIntervalMs: 1000 * 10, // Mantiene la conexión activa (cada 10 segundos).
      emitOwnEvents: false, // No emitir eventos para las acciones propias del bot.
      syncFullHistory: false, //No sincronisar mensajes del telefono.
      markOnlineOnConnect: true, // Marcar como "en línea" al conectarse.
      generateHighQualityLinkPreview: true, // Generará vistas previas de alta calidad para enlaces.
      getMessage: async (key) => {
        let jid = jidNormalizedUser(key.remoteJid); // Normaliza el JID del chat.
        let message = await store.loadMessage(jid, key.id); // Carga el mensaje desde el store usando el JID y el ID del mensaje
    
        // Si el mensaje existe, devuelve el contenido del mensaje, de lo contrario, devuelve una cadena vacía
        return message.message || ''; 
      }
    });
    store.bind(conn.ev);
    conn = await Client(conn, store );

    loadPluginFiles(pluginFolder, pluginFilter, {
      logger: conn.logger,
      recursiveRead: true,
    });

    conn.ev.on('connection.update', async (update) => {
      const { qr, connection, lastDisconnect } = update;
      
      if (lastDisconnect?.error) {
        qrGenerated = false;
        serBotQR();
      }

      if (qr && !qrGenerated) {  
        qrGenerated = true; 
        let qrCodeUrl = await qrcode.toBuffer(qr, { scale: 8 });
        const qrMessage = await sock.sendMessage(m.chat, { image: qrCodeUrl, caption: '*Escanea este Código QR para convertirte en SockAi(sub-Bot)*.' }, { quoted: m });
        
        setTimeout(async () => await sock.sendMessage(m.chat, { delete: qrMessage.key }), 70000);
      }

      if (connection === 'open') {
        m.reply('*Has sido conectado exitosamente como sub-bot* 🥳');
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