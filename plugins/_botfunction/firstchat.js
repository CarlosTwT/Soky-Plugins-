export async function before(m) {
    if (m.chat.endsWith("broadcast") || m.fromMe || m.isGroup || m.isCommand) return
    let user = db.users[m.sender]
    let txt = `Hola ${m.pushName} ${m.isOwner ? 'Owner' : 'usuario'}\n\n${user.banned ? `Has sido baneado, contacta al propietario para desbanearte.!` : 'Soy Soky Ai, puedes seguir en instagram a mi creador\n\nDisfruta de este bot escribiendo\n.menu para ver mis comandos\n.ai para usar la inteligencia artificial.'}`
    if (new Date() - user.firstchat < 21600000) return
    sock.reply(m.chat, txt, m)
    user.firstchat = new Date * 1
}
