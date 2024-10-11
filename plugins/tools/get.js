/**
  * Don't delete wm
  * By Aureel
**/
import { format } from "util";
import axios from "axios";
import fetch from "node-fetch";

export default {
  name: 'fetch',
  tags: 'tools',
  command: ['fetch', 'get'],
  description: 'Recuperar datos json de sitios web',
  example: '',
  run: async(m, { sock, args }) => {
    const text = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text) || "";
    if (!text) return m.reply(`Por favor proporcione una URL\n\nAhora puede utilizar las siguientes opciones:\n\n* \`--data\`: Enviar datos con la solicitud. Puede especificar pares clave-valor separados por \`&\`.\n* \`--header\`: Especifique encabezados personalizados. Puede especificar pares clave-valor separados por \`&\`.\n* \`--referer\`: Set the \`Referer\` header.\n* \`--responseType\`: Especifique el tipo de respuesta. Puedes elegir entre \`json\`, \`arraybuffer\`, \`blob\`, \`document\`, or \`stream\`.\n* \`--method\`: Especifique el método de solicitud. Puedes elegir entre \`GET\`, \`HEAD\`, \`POST\`, \`PUT\`, \`PATCH\`, or \`DELETE\`.`);
    const urlRegex = /\b(https?:\/\/[^\s]+)/gi;
    const urlMatch = text.match(urlRegex);
    const url = urlMatch ? urlMatch[0].trim() : null;
    if (!url) return m.reply("¿Dónde está la URL???");
    m.reply(global.status.wait)

    let _url = new URL(url);
    let URl = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), "APIKEY");

    let options = {};
    let data = null;
    let method = "GET";
    let responseType = "json";

    const dataFlag = text.includes("--data");
    const headerFlag = text.includes("--header");
    const refererFlag = text.includes("--referer");
    const responseTypeFlag = text.includes("--responseType");
    const methodFlag = text.includes("--method");

    if (dataFlag) {
      const dataArray = text.split("--data")[1].trim().split("&");
      data = {};
      dataArray.forEach((pair) => {
        const [key, value] = pair.split("=");
        data[key] = value;
      });
    }

    if (headerFlag) {
      const headerArray = text.split("--header")[1].trim().split("&");
      options.headers = {};
      headerArray.forEach((pair) => {
        const [key, value] = pair.split("=");
        options.headers[key] = value;
      });
    }

    if (refererFlag) {
      const referer = text.split("--referer")[1].trim();
      options.headers = options.headers || {};
      options.headers.Referer = referer;
    }

    if (responseTypeFlag) {
      const responseTypeValue = text.split("--responseType")[1].trim();
      responseType = responseTypeValue;
    }

    if (methodFlag) {
      const methodValue = text.split("--method")[1].trim().toUpperCase();
      method = methodValue;
    }

    let res;
    if (method === "HEAD") {
      res = await axios.head(URl, options);
    } else if (method === "POST") {
      res = await (await axios.post(URl, data, options)).data;
    } else {
      res = await fetch(URl, {
        method,
        body: data,
        headers: options.headers,
      });
      if (res.headers.get("content-length") > 100 * 1024 * 1024 * 1024) {
        throw `Content-Length: ${res.headers.get("content-length")}`;
      }
    }
    if (method === "HEAD") {
      m.reply(`${JSON.stringify(res.headers, null, 2)}`);
    } else {
      if (!/text|json/.test(res.headers.get("content-type"))) {
        return sock.reply(m.chat, `Solo hazlo tu mismo\n\n*-* *Url* : ${url}\n*-* *Text* : ${text}`, m);
      }
      let txt = await res.buffer();
    try {
      txt = format(JSON.parse(txt + ""));
    } catch (e) {
      txt = txt + "";
    } finally {
      m.reply(txt.slice(0, 65536) + "");
    }
    }
  }
}