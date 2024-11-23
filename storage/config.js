import fs from 'fs'
import axios from 'axios'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import chalk from "chalk"
import { fileURLToPath } from "url"
import Function from "../system/lib/function.js"
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)  

/** settings number **/
global.owner = ["593991398786"]
global.pairingNumber = "593986755613" //está con número del bot
global.write_store = false

/** function to make it more practical **/
global.Func = await new (await import('../storage/script/functions.js')).default();
global.Uploader = await new (await import('../storage/script/uploader.js')).default();
global.UploaderV2 = (await import('../storage/script/uploaderV2.js')).default
global.scrap = await import('../storage/script/scraper.js')

/** tools **/
global.fs = fs
global.axios = axios
global.cheerio = cheerio
global.fetch = fetch
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.readMore = readMore

global.multiplier = 1000 // Cuanto más grande se vuelve, más difícil es subir de nivel.
global.max_upload = 70 // Límite máximo para enviar archivos
global.intervalmsg = 1800 // Para evitar el spam en el primer inicio de sesión
global.ram_usage = 2100000000 // Máximo 2 GB de RAM, haz el cálculo tú mismo

global.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i
global.thumbnail = fs.readFileSync("./storage/media/thumbnail.jpg")
global.timeImage = Function.timeImage()
global.ucapan = Function.timeSpeech()
global.func = Function

/** apikey **/
global.ssa = 'https://api.ssateam.my.id'
global.key = 'isiajasendiri'

global.APIs = {
  ssa: 'https://api.ssateam.my.id',
  ana: 'https://anabot.my.id',
  dlr: 'http://144.126.156.179'
}

global.APIKeys = {
  'https://anabot.my.id/api': key
}

/** don't remove **/
global.opts = {
  qr: false,
  pairing: true
}

/** options setting **/  
global.set = {
  wm: `© Soky v0.0.1`,
  footer: 'Powered By Carlos',
  version: 'v0.0.1',
  packname: 'Sticker By',
  author: '© Soky'
}

/** canal aqui **/
global.ch = {
  ssa: '120363301101357890@newsletter',
  ssaclone: '120363301101357890@newsletter'
}

/** hacer galletas/api scraper aquí **/
global.api = {
  groq: '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',
  useragent: 'Mozilla/5.0 (Linux; Android 10; SM-A105G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
  bing: ''
}

/** opciones de redes sociales **/  
global.media = {
  sig: 'https://instagram.com/c4rl0s_9e',
  syt: 'https://www.youtube.com/@byCarlosE',
  sgh: 'https://github.com/CarlosTwT',
  sch: 'https://whatsapp.com/channel/0029ValFD2SFXUuaKQNsVB3h',
  sr: '',
  swa: 'https://wa.me/593991398786',
  scm: '120363301101357890@newsletter' // identificación comunitaria, requerida
}

/** configuración tu miniatura está aquí **/
global.thumb = 'https://telegra.ph/file/7c56992ce2631432d3435.jpg'
global.thumb2 = 'https://telegra.ph/file/51dbbb9a1e71a021ee457.jpg'

/** mensajes de estado **/
global.status = Object.freeze({
  wait: Func.texted('bold', 'Procesando la solicitud. . .'),
  invalid: Func.texted('bold', 'URL invalida!'),
  wrong: Func.texted('bold', 'Formato incorrecto!'),
  getdata: Func.texted('bold', 'Scraping metadatos . . .'),
  fail: Func.texted('bold', 'No pude obtener metadatos!'),
  error: Func.texted('bold', 'Ocurrió un error!'),
  errorF: Func.texted('bold', 'Lo siento, esta característica está dando un error.'),
  premium: Func.texted('bold', 'Esto solo es para usuarios premiums.'),
  limit: Func.texted('bold', 'Su límite de prueba se ha agotado, no podrá acceder a algunos comandos temporalmente. '),
  owner: Func.texted('bold', 'Este comando es sólo para propietarios.'),
  god: Func.texted('bold', 'Este comando es solo para Carlos'),
  group: Func.texted('bold', 'Este comando solo funcionará en grupos.'),
  botAdmin: Func.texted('bold', 'Este comando funcionará cuando me convierta en administrador.'),
  admin: Func.texted('bold', 'Este comando es sólo para administradores de grupo.'),
  restrict: Func.texted('bold', 'Este comando está deshabilitado.'),
  private: Func.texted('bold', 'Utilice este comando en el chat privado.'),
  reg: Func.texted('bold', 'Hola, regístrese primero para utilizar esta función.\nEscribe .reg nombre.edad\nEjemplo .reg c.17'),
  quoted: Func.texted('bold', 'Responder un mensaje'),
  image: Func.texted('bold', 'Responde una foto o envia una foto con el comando'),
  sticker: Func.texted('bold', 'Responde un sticker'),
  video: Func.texted('bold', 'Responde a un video o envia un video con el comando'),
  audio: Func.texted('bold', 'Responde a un audio')
})

/** no lo cambies **/
global.adReply = {
  contextInfo: {
    externalAdReply: {
      title: set.wm,
      body: ucapan,
      description: set.author,
      previewType: "PHOTO",
      thumbnail: thumbnail,
      mediaUrl: media.sig,
      sourceUrl: media.sig
    }
  }
}

/** realod file **/
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update config.js"))
  import(`${file}?update=${Date.now()}`)
})