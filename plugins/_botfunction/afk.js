export function before(m, { sock }) {
  let user = global.db.users[m.sender];
  if (user.afk > -1) {
    m.reply(`te has detenido en AFK${user.afkReason ? ' after ' + user.afkReason : ''}\nDurante ${((new Date() - user.afk) / 1000 / 60).toFixed(1)} minutos`);
    user.afk = -1;
    user.afkReason = '';
  }

  let jids = [ ...new Set([ ...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : []), ]) ];
  for (let jid of jids) {
    let mentionedUser = global.db.users[jid];
    if (!mentionedUser) continue;
    let afkTime = mentionedUser.afk;
    if (!afkTime || afkTime < 0) continue;
    let reason = mentionedUser.afkReason || '';
    m.reply(`¡No lo etiquetes!, está AFK ${reason ? 'Razón ' + reason : 'sin razón'}\nDurante ${((new Date() - afkTime) / 1000 / 60).toFixed(1)} minutos`);
  }
  return true;
}
