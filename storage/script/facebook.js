import axios from 'axios';
import qs from 'qs'; 

export async function downloadFacebookVideo(videoUrl) {
  try {
    const postData = qs.stringify({
      url: videoUrl,
      token: ''
    });

    const { data } = await axios.post('https://snapfrom.com/wp-json/aio-dl/video-data/', postData, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
        'Accept-Language': 'es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      }
    });

    const videoData = data.medias.find(video => video.quality	== 'hd') || data.medias[0];

    return videoData.url;
  } catch (error) {
    console.error('Error downloading video:', error);
  }
}