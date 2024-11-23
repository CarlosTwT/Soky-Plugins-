export default {
    name: 'groupinfo',
    tags: 'group',
    command: ['groupinfo', 'gcinfo'],
    description: 'Muestra información detallada del grupo',
    limit: false,
    group: true,
    run: async (m, { sock }) => {
        function convertTimestamp(timestamp) {
            const d = new Date(timestamp * 1000);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return {
                date: d.getDate(),
                month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d),
                year: d.getFullYear(),
                day: daysOfWeek[d.getUTCDay()],
                time: `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`
            }
        }

        try {
            let info = await sock.groupMetadata(m.chat);
            let ts = convertTimestamp(info.creation);

            let pp;
            try {
                pp = await sock.profilePictureUrl(m.chat, 'image');
            } catch {
                pp = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }

            let caption = `*乂 GROUP INFORMATION*\n\n`;
            caption += `  ◦  *Name* : ${info.subject}\n`;
            caption += `  ◦  *ID* : ${info.id}\n`;
            caption += `  ◦  *Owner* : ${info.owner ? '@' + info.owner.split('@')[0] : 'No Creator'}\n`;
            caption += `  ◦  *Created* : ${ts.day}, ${ts.date} ${ts.month} ${ts.year}, ${ts.time}\n`;
            caption += `  ◦  *Members* : ${info.size}\n`;
            caption += `  ◦  *Participants* : ${info.participants.filter(p => p.admin === null).length}\n`;
            caption += `  ◦  *Admins* : ${info.participants.filter(p => p.admin !== null).length}\n`;
            caption += `  ◦  *Message Settings* : ${info.announce ? 'Only Admins' : 'Everyone'}\n`;
            caption += `  ◦  *Edit Info* : ${info.restrict ? 'Only Admins' : 'Everyone'}\n`;
            caption += `  ◦  *Add Participants* : ${info.memberAddMode ? 'Everyone' : 'Only Admins'}\n\n`;
            caption += global.set.footer;

            await sock.sendMessage(m.chat, { 
                image: { url: pp }, 
                caption: caption,
                mentions: [info.owner]
            }, { quoted: m });

        } catch (error) {
            console.error(error);
            m.reply(global.status.error);
        }
    }
};