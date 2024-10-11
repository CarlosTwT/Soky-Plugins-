import os from 'os'
import fs from 'fs'

let menu = {
  before: `Hola @%user %ucapan!
Por favor usa este bot con precaución.

> *-* *Version* : %version
> *-* *Source* : https://github.com/CarlosTwT

Si encuentra un error o desea una actualización a premium, comuníquese con el propietario. %readmore\n`.trimStart(),
  header: '*[ %category ]*',
  body: '*-* %cmd',
  footer: '',
  after: '*Nota* : Para encontrar más información sobre los comandos, puede escribir comandos y agregar --\nEjemplo: .menu --tiktok'
}

let tags = {
  'download': 'Download Menu',
  'rpg': 'RPG Menu',
  'convert': 'Convert Menu',
  'group': 'Group Menu',
  'info': 'Information Menu',
  'main': 'Main Menu',
  'owner': 'Owner Menu',
  'tools': 'Tools Menu'
}

export default {
  name: 'menu',
  tags: 'main',
  command: ['menu', 'help', 'tesm'],
  description: 'Para mostrar un menú basado en una lista y ver cómo utilizar el menú',
  example: '',
  register: false,
  run: async(m, { sock, isPrem, text, command }) => {
    if (text.startsWith('--')) {
      let name = text.toLowerCase().replace('--', ''), data = []
      let cmd = Object.values(plugins).find(plugin => plugin.name === name)
      if (!cmd) return m.reply('Comando no encontrado')
      if (cmd.name) data.push('*Nombre:* ' + cmd.name)
      if (cmd.command) data.push('*Comando:* ' + cmd.command.join(', '))
      if (cmd.description) data.push('*Descripción:* ' + cmd.description)
      if (cmd.example) data.push('*Use:* ' + m.prefix + cmd.command[0])
      m.reply(data.join('\n'))
    } else {
      let more = String.fromCharCode(8206)
      let readMore = more.repeat(4001)
      let totalreg = Object.keys(global.db.users).length
      let rtotalreg = Object.values(global.db.users).filter(user => user.registered == true).length
      let version = global.set.version
      let { level, limit, name, premium, money } = db.users[m.sender]
        let help = Object.values(plugins).map(plugin => {
          return {
            cmd: Array.isArray(plugin.name) ? plugin.name : [plugin.name],
            tags: [plugin.tags],
            limit: plugin.limit,
            description: plugin.description,
            premium: plugin.premium
          }
        })
    	let text = [menu.before, ...Object.keys(tags).map(tag => {
    	  return menu.header.replace(/%category/g, tags[tag]) + '\n' + [...help.filter(aa => aa.tags.includes(tag) && aa.cmd).map(a => {
    	    return a.cmd.map(help => {
    		  return menu.body.replace(/%cmd/g, m.prefix + help).replace(/%description/g, a.description).replace(/%isLimit/g, a.limit ? '(Limit)' : '').replace(/%isPremium/g, a.premium ? '(Premium)' : '').trim()
    		}).join('\n')
    	  }), menu.footer].join('\n')
    	}), menu.after].join('\n')
    	text = text.replace(/%user/, m.sender.split('@')[0]).replace(/%ucapan/, ucapan).replace(/%version/, version).replace(/%rtotalreg/, rtotalreg).replace(/%totalreg/, totalreg).replace(/%uptime/, func.runtime(process.uptime())).replace(/%prefix/, m.prefix).replace(/%database/, Object.keys(db.users).length).replace(/%memory_used/, func.formatSize(os.totalmem() - os.freemem())).replace(/%memory_free/, func.formatSize(os.totalmem())).replace(/%name/, name).replace(/%limit/, premium ? 'Infinity' : limit + '/25').replace(/%level/, level).replace(/%money/, money.toLocaleString()).replace(/%status/, premium ? 'Premium' : 'Free').replace(/%readmore/, readMore)
    	let style = db.settings.style
    	if (style === 1) {		    	
    	sock.sendMessage(m.chat, { text: text.trim(),
    	  contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [m.sender],
              forwardedNewsletterMessageInfo: {
                newsletterName: "Información sobre bots | Soky",
                newsletterJid: global.ch.ssa,
              },
                externalAdReply: {
                  mediaType: 1,
                  previewType: 'pdf',
                  title: global.set.wm,
                  body: null,
                  thumbnail: timeImage,
                  renderLargerThumbnail: true,
                  sourceUrl: global.media.sgc
                }
              }
          }, { quoted: m })
    	} else if (style === 2) {
          sock.sendOrder(m.chat, text.trim(), fs.readFileSync('./storage/media/thumbnail.jpg'), '2018', 100000, m)
    	} else if (style === 3) {
          sock.sendFThumb(m.chat, global.set.wm, text.trim(), "https://tmpfiles.org/dl/11724252/tmp.jpg", media.sig, m)
        }
    }
  }
}