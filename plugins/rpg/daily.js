import fs from 'fs';
const rewards = {
  exp: 12000,
  money: 10000,
  potion: 5,
}
const cooldown = 86400000

export default {
    command: ["claim", "daily"],
    description: "Reclama tu premio diario aquí",
    example: "",
    name: "daily",
    tags: "rpg",
    cooldown: cooldown,

    run: async(m, { sock, command, args }) => {
	let user = global.db.users[m.sender]
  if (new Date - user.lastclaim < cooldown) throw `¡Ya has reclamado este reclamo diario!, espera unas horas`
  let text = ''
  for (let reward of Object.keys(rewards)) {
	if (!(reward in user)) continue
	user[reward] += rewards[reward]
	text += `*+${rewards[reward]}* ✨ ${(reward)}${reward}\n`
  }
  m.reply(text.trim())
  user.lastclaim = new Date * 1
}
}
