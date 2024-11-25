import axios from 'axios';
import cheerio from 'cheerio';

export default {
  name: 'twitter',
  tags: 'download',
  command: ['twitter', 'twt'],
  description: 'Descarga videos de Twitter',
  example: 'twitter <url>',
  run: async (m, { sock }) => {
    try {
      let url = m.text;
      if (!url) throw 'Por favor, proporciona una URL de Twitter';

      m.reply('Descargando video, por favor espere...');

      let downloadResult = await twitterDL(url);

      if (!downloadResult.status || downloadResult.media.length === 0) {
        downloadResult = await twitterDLv2(url);
      }

      if (!downloadResult.status || downloadResult.media.length === 0) {
        throw 'Error al descargar video de Twitter';
      }

      const media = downloadResult.media[0].url || downloadResult.media[0];

      const { data: videoBuffer } = await axios.get(media, { responseType: 'arraybuffer' });

      const caption = `Video descargado de Twitter`;

      await sock.sendMessage(
        m.chat, {
          video: videoBuffer,
          mimetype: "video/mp4",
          fileName: 'video.mp4',
          caption: caption,
          mentions: [m.sender],
        }, {
          quoted: m
        }
      );
    } catch (error) {
      console.error('Error:', error);
      m.reply('Ocurrió un error al descargar el video de Twitter.');
    }
  }
};

async function twitterDL(url) {
  try {
    const result = { status: true, type: "", media: [] };
    const { data } = await axios(`https://savetwitter.net/api/ajaxSearch`, {
      method: "post",
      data: { q: url, lang: "en" },
      headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2",
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    let $ = cheerio.load(data.data);
    if ($("div.tw-video").length === 0) {
      $("div.video-data > div > ul > li").each(function () {
        result.type = "image";
        result.media.push($(this).find("div > div:nth-child(2) > a").attr("href"));
      });
    } else {
      $("div.tw-video").each(function () {
        let qualityText = $(this).find(".tw-right > div > p:nth-child(1) > a").text().includes("(")
          ? $(this).find(".tw-right > div > p:nth-child(1) > a").text().split("(")[1].split("p")[0].trim()
          : $(this).find(".tw-right > div > p:nth-child(1) > a").text().trim();

        result.type = "video";
        result.media.push({
          quality: qualityText,
          url: $(this).find(".tw-right > div > p:nth-child(1) > a").attr("href")
        });
      });
    }

    return result;
  } catch (err) {
    const result = {
      status: false,
      message: "Media not found!\n\n" + String(err)
    };
    console.log(result);
    return result;
  }
}

async function twitterDLv2(url) {
  try {
    const { data } = await axios.get(`https://twitsave.com/info?url=${url}`);
    let $ = cheerio.load(data);
    let result = [];

    $("div.origin-top-right > ul > li").each(function () {
      const resolutionText = $(this).find("a > div > div > div").text();
      if (resolutionText.includes("Resolution: ")) {
        const width = resolutionText.split("Resolution: ")[1].split("x")[0];
        const height = resolutionText.split("Resolution: ")[1].split("x")[1];
        const videoUrl = $(this).find("a").attr("href");
        result.push({ width, height, url: videoUrl });
      }
    });

    if (result.length === 0) {
      return { status: false, message: "Tidak dapat menemukan video" };
    }

    const sortedResult = result.sort((a, b) => b.height - a.height);
    const highestResolution = sortedResult[0].width;
    return { status: true, media: sortedResult.filter((video) => video.width === highestResolution) };

  } catch (err) {
    return { status: false, message: "Error fetching from twitsave\n\n" + String(err) };
  }
}