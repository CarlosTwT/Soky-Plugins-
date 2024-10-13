import "../storage/config.js"
import { Client, Serialize } from "./lib/serialize.js"
import pino from "pino"
import { fileURLToPath } from "url"
import chalk from "chalk"
import readline from "readline"
import chokidar from "chokidar"
import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import baileys from "@whiskeysockets/baileys"
import os from "os"
import axios from "axios"
import fs from "fs"
import path from 'path';
import { format, promisify, isDeepStrictEqual } from 'util';
import { plugins, loadPluginFiles, reload, pluginFolder, pluginFilter } from "./lib/plugins.js";
import { dirname } from 'path';
import { participantsUpdate } from "./handler.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Global API Update
global.API = (name, path = "/", query = {}, apikeyqueryname) => {
  const baseUrl = name in global.APIs ? global.APIs[name] : name;
  const apiKey = apikeyqueryname ? global.APIKeys[baseUrl] : "";
  const queryParams = new URLSearchParams({ ...query, ...(apikeyqueryname && apiKey ? { [apikeyqueryname]: apiKey } : {}) });
  return baseUrl + path + (queryParams.toString() ? "?" + queryParams : "");
};

const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({ class: "irull2nd" }); logger.level = "fatal"
global.store = baileys.makeInMemoryStore({ logger })

if (global.write_store) store.readFromFile("./storage/store.json");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const database = (new (await import("./lib/database.js")).default())
const ini = global.opts.qr

async function start() {
    process.on("uncaughtException", (err) => console.error(err))
    process.on("unhandledRejection", (err) => console.error(err))

    const content = await database.read()
    if (content && Object.keys(content).length === 0) {
        global.db = { users: {}, chats: {}, stats: {}, msgs: {}, saweria: {}, sticker: {}, settings: {}, ...(content || {}) }
        await database.write(global.db)
    } else {
        global.db = content
    }
    
    const msgRetryCounterCache = new NodeCache()
    const { state, saveCreds } = await baileys.useMultiFileAuthState("./storage/temp/session")
    
    const sock = baileys.default({
        msgRetryCounterMap: {},
        logger: logger,
        printQRInTerminal: ini,
        auth: {
           creds: state.creds,
           keys: baileys.makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: baileys.Browsers.windows("Safari"),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
           let jid = baileys.jidNormalizedUser(key.remoteJid)
           let msg = await store.loadMessage(jid, key.id)
    
           return msg?.message || ""
           return proto.Message.fromObject({});
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: 0,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true
    })
    

    store.bind(sock.ev)
    await Client(sock, store)
    global.sock = sock
    
    loadPluginFiles(pluginFolder, pluginFilter, {
      logger: sock.logger,
      recursiveRead: true,
    }).then((_) => console.log(chalk.bgBlue('Obtención exitosa de plugins.'))).catch(console.error);
    
    if (global.opts.pairing) {
    if (!sock.authState.creds.registered) {
        let phoneNumber
        if (!!global.pairingNumber) {
            phoneNumber = global.pairingNumber.replace(/[^0-9]/g, "")

            if (!Object.keys(baileys.PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Comienza con el código de WhatsApp de tu país, Ejemplo : 593xxx")))
                process.exit(0)
            }
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright("Por favor escriba su número de WhatsApp : ")))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, "")

            if (!Object.keys(baileys.PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("omienza con el código de WhatsApp de tu país, Ejemplo : 593xxx")))

                phoneNumber = await question(chalk.bgBlack(chalk.greenBright("Por favor escriba su número de WhatsApp : ")))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
                rl.close()
            }
        }
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen("Tu código de emparejamiento : ")), chalk.black(chalk.white(code)))
        }, 3000)
    }
    }

    sock.ev.on("connection.update", async (update) => {
         const { receivedPendingNotifications } = update //Mengatasi Bug Session
         if (receivedPendingNotifications) {
         sock.ev.flush()
         }
         
        const { lastDisconnect, connection, qr } = update

        if (connection) sock.logger.info(`Connection Status : ${connection}`)
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode

            if (reason === baileys.DisconnectReason.badSession) {
                console.log("El archivo de sesión está dañado; elimine la sesión y escanee nuevamente")
                process.send("reset")
            } else if (reason === baileys.DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnect....")
                await start()
            } else if (reason === baileys.DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnect...")
                await start()
            } else if (reason === baileys.DisconnectReason.connectionReplaced) {
                console.log("Conexión cambiada, nueva sesión abierta, cierre primero la sesión actual")
                process.exit(1)
            } else if (reason === baileys.DisconnectReason.loggedOut) {
                console.log("Device Exited, Please Scan Again")
                process.exit(1)
            } else if (reason === baileys.DisconnectReason.restartRequired) {
                console.log("Restart Required, Restart...")
                await start()
            } else if (reason === baileys.DisconnectReason.timedOut) {
                console.log("Connection Timed Out, Restart...")
                process.send("reset")
            } else if (reason === baileys.DisconnectReason.multideviceMismatch) {
                console.log("Incompatibilidad con múltiples dispositivos, escanee nuevamente")
                process.exit(0)
            } else {
                console.log(reason)
                process.send("reset")
            }
        }
        
        if (connection === "connecting") {
          console.log(`${chalk.bold.green(`Soky Bot WhatsApp`)}`)
          console.log(`${chalk.yellow.bgBlack(`Created By Sock.`)}`)
          console.log(chalk.blue(`[ Conectado ]`));
      }
     
        if (connection === "open") {
          const { jid } = sock.user;
          await func.sleep(5000);
          console.log(chalk.blue(`Conexión a la web de WhatsApp`));
          console.log(chalk.green(`[ Connected ] ` + JSON.stringify(sock.user, null, 2)));
          await func.sleep(1000);            
            const currentTime = new Date();
            const pingSpeed = new Date() - currentTime;
            const formattedPingSpeed = pingSpeed < 0 ? 'N/A' : `${pingSpeed}ms`;
            const infoMsg = `Soky Ai, Online..\n\n*[ Sobre el sistema ]*\nSpeed: ${formattedPingSpeed}\nFecha:  ${currentTime.toDateString()}, ${currentTime.toLocaleDateString('ec-EC', { weekday: 'long' })}\nHora actual: ${currentTime}`;
            await sock.sendMessage(`593991398786@s.whatsapp.net`, { text: infoMsg, mentions: [owner + '@s.whatsapp.net', jid] }, { quoted: null });
        }
        });

        sock.ev.on("creds.update", saveCreds);

  // add contacts update to store
  sock.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = baileys.jidNormalizedUser(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

  // add contacts upsert to store
  sock.ev.on("contacts.upsert", (update) => {
    for (let contact of update) {
      let id = baileys.jidNormalizedUser(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { ...(contact || {}), isContact: true };
    }
  });

  // nambah perubahan grup ke store
  // sock.ev.on("group-participants.update", async (updates) => {
  //   console.log(updates)
    // const dbPath = path.join(__dirname, '..', 'storage', 'database', 'welcome.json')
    // const db = JSON.parse(fs.readFileSync(dbPath));

    // if(db.includes(updates.id)) {
    //   await participantsUpdate(updates.id, updates.participants[0], updates.action);
    // }
    // for (const update of updates) {
    //   const id = update.id;
    //   if (store.groupMetadata[id]) {
    //     store.groupMetadata[id] = {
    //       ...(store.groupMetadata[id] || {}),
    //       ...(update || {}),
    //     };
    //   }
    // }
  // });

  sock.ev.on("messages.upsert", async (message) => {
    if (!message.messages) return;
    const m = await Serialize(sock, message.messages[0]);
      if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0)
      store.groupMetadata = await sock.groupFetchAllParticipating();
    await (await import(`./handler.js`)).handler(sock, m, message);
  });

  sock.ev.on("group-participants.update", async (message) => {
    await (await import(`./handler.js?v=${Date.now()}`)).participantsUpdate(message.id, message.participants[0], message.action);
  });

  sock.ev.on("groups.update", async (update) => {
    await (await import(`./handler.js?v=${Date.now()}`)).groupsUpdate(update);
  });

  sock.ev.on("call", async (json) => {
    await (await import(`./handler.js?v=${Date.now()}`)).rejectCall(json);
  });

  sock.ev.on("presence.update", async (presenceUpdateEvent) => {
    try {
      await (await import(`./handler.js?v=${Date.now()}`)).presenceUpdate(presenceUpdateEvent);
    } catch (error) {
      console.error("Error handling presence update:", error);
    }
  });

  setInterval(async () => {
    if (global.write_store) {
      store.writeToFile("./storage/store.json", true)
    }
  }, 10 * 1000)

  setInterval(async () => {
    if (global.db) await database.write(global.db)
  }, 30000)
  
  return sock
}
start()

/** realod file **/
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update main.js"))
  import(`${file}?update=${Date.now()}`)
})
