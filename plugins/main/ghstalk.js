import axios from 'axios';

export default {
  name: 'githubstalk',
  tags: 'internet',
  command: ['githubstalk'],
  description: 'Busca información de un usuario de GitHub',
  example: 'githubstalk <usuario>',
  run: async (m, { sock }) => {
    try {
      let user = m.text;
      if (!user) throw 'Por favor, proporciona un nombre de usuario de GitHub';

      await sock.reply(m.chat, 'Buscando información, por favor espere...');

      let request = await githubstalk(user);
      let {
        username,
        following,
        followers,
        type,
        bio,
        company,
        blog,
        location,
        email,
        public_repo,
        public_gists,
        profile_pic,
        created_at,
        updated_at,
        html_url,
        name
      } = request;

      let thumb = await getBuffer(profile_pic);
      if (!thumb) {
        return sock.reply(m.chat, 'Error al descargar la imagen de perfil.');
      }

      let busq = `*── 「 GITHUB STALK 」 ──*\n
➸ *Username*: ${username} (${name})
➸ *LINK*: ${html_url}
➸ *Link Gists:* https://gist.github.com/${username}/
➸ *Bio*: _${bio}_
➸ *Company*: ${company}
➸ *Email:* ${email}
➸ *Blog:* ${blog}
➸ *Repo Public:* ${public_repo}
➸ *Gists Public:* ${public_gists}
➸ *Follower:* ${followers}
➸ *Following:* ${following}
➸ *Location:* ${location}
➸ *Type:* ${type}
➸ *Created at:* ${created_at}
➸ *Updated at:* ${updated_at}
`;

      await sock.sendMessage(m.chat, {
        image: thumb,
        caption: busq,
        mentions: [m.sender],
      }, { quoted: m });
    } catch (error) {
      console.error('Error:', error);
      await sock.reply(m.chat, 'Ocurrió un error al procesar la solicitud.');
    }
  }
};

async function getBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error fetching buffer:', error);
    return null;
  }
}

async function githubstalk(user) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.github.com/users/' + user)
      .then(({ data }) => {
        let hasil = {
          username: data.login,
          name: data.name,
          bio: data.bio,
          id: data.id,
          nodeId: data.node_id,
          profile_pic: data.avatar_url,
          html_url: data.html_url,
          type: data.type,
          admin: data.site_admin,
          company: data.company,
          blog: data.blog,
          location: data.location,
          email: data.email,
          public_repo: data.public_repos,
          public_gists: data.public_gists,
          followers: data.followers,
          following: data.following,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        resolve(hasil);
      })
      .catch(error => {
        console.error('API error:', error);
        reject(error);
      });
  });
}