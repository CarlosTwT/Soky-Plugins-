import axios from "axios"

export const scraperPinterest = async (text) => {
  try {
    const getRandom = Math.floor(Math.random() * 10);
    const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
    const url = [];
    for(let i = 0; i < 10; i++) {
      const pinData = data.resource_response.data.results[i];
      url.push(pinData.images.orig.url);
    }
    
    return url
  } catch (error) {
    console.error(error);
    return 'server error';
  }
};