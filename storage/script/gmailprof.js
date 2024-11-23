import axios from 'axios';
import * as cheerio from 'cheerio';

const gmailProfile = {
  check: async function(email) {
    try {
      const username = email.split('@')[0];
      const { data } = await axios.post('https://gmail-osint.activetk.jp/', new URLSearchParams({ q: username, domain: 'gmail.com' }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Postify/1.0.0' }
      });
      const $ = cheerio.load(data);
      const text = $('pre').text();
      return {
        photoProfile: this.extract(text, /Custom profile picture !\s*=>\s*(.*)/, 'No hay'),
        email,
        lastEditProfile: this.extract(text, /Last profile edit : (.*)/),
        googleID: this.extract(text, /Gaia ID : (.*)/),
        userTypes: this.extract(text, /User types : (.*)/),
        googleChat: {
          entityType: this.extract(text, /Entity Type : (.*)/),
          customerID: this.extract(text, /Customer ID : (.*)/, 'No', true),
        },
        googlePlus: {
          enterpriseUser: this.extract(text, /Entreprise User : (.*)/),
        },
        mapsData: {
          profilePage: this.extract(text, /Profile page : (.*)/),
        },
        ipAddress: text.includes('Your IP has been blocked by Google') ? 'Bloqueado por Google' : 'Seguro',
        calendar: text.includes('No public Google Calendar') ? 'no hay' : 'hay'
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  extract: function(text, regex, defaultValue = 'no hay', checkNotFound = false) {
    const result = (text.match(regex) || [null, defaultValue])[1].trim();
    return checkNotFound && result === 'Not found.' ? 'no hay' : result;
  }
};

export { gmailProfile };