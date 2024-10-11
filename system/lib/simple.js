import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia, generateWAMessageFromContent, proto } = pkg;
import fetch from 'node-fetch';

const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60;

export async function sendCarousel(jid, text = '', footer = '', text2 = '', messages, quoted, options) {
  if (messages.length > 1) {
    const cards = await Promise.all(messages.map(async ([text = '', footer = '', buffer, buttons = [], copy = [], urls = [], list = []]) => {
      let media = null;

      if (/^https?:\/\//i.test(buffer)) {
        try {
          const response = await fetch(buffer);
          const contentType = response.headers.get('content-type');
          if (/^image\//i.test(contentType)) {
            media = await prepareWAMessageMedia({ image: { url: buffer } }, { upload: sock.waUploadToServer, ...options });
          } else if (/^video\//i.test(contentType)) {
            media = await prepareWAMessageMedia({ video: { url: buffer } }, { upload: sock.waUploadToServer, ...options });
          }
        } catch (error) {
          console.error("Failed to get MIME type:", error);
        }
      } else {
        try {
          const type = await sock.getFile(buffer);
          if (/^image\//i.test(type.mime)) {
            media = await prepareWAMessageMedia({ image: type.data }, { upload: sock.waUploadToServer, ...options });
          } else if (/^video\//i.test(type.mime)) {
            media = await prepareWAMessageMedia({ video: type.data }, { upload: sock.waUploadToServer, ...options });
          }
        } catch (error) {
          console.error("Failed to get file type:", error);
        }
      }

      const dynamicButtons = [
        ...buttons.map(([text, id]) => ({
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({ display_text: text, id })
        })),
        ...copy.map(([text]) => ({
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({ display_text: 'Copy', copy_code: text })
        })),
        ...urls.map(([text, url]) => ({
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({ display_text: text, url })
        })),
        ...list.map(([title, sections]) => ({
          name: 'single_select',
          buttonParamsJson: JSON.stringify({ title, sections })
        }))
      ];

      return {
        body: proto.Message.InteractiveMessage.Body.fromObject({ text }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footer }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: text2,
          subtitle: text,
          hasMediaAttachment: !!media,
          ...media
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: dynamicButtons,
          messageParamsJson: ''
        }),
        mentions: typeof text === 'string' ? sock.parseMention(text) : [],
        contextInfo: { ...options?.contextInfo }
      };
    }));

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      body: proto.Message.InteractiveMessage.Body.fromObject({ text }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footer }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: text,
        subtitle: text,
        hasMediaAttachment: false
      }),
      carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards }),
      mentions: typeof text === 'string' ? sock.parseMention(text) : [],
      contextInfo: { ...options?.contextInfo }
    });

    const messageContent = proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage
        }
      }
    });

    const msgs = await generateWAMessageFromContent(jid, messageContent, {
      userJid: sock.user.jid,
      quoted,
      upload: sock.waUploadToServer,
      ephemeralExpiration: WA_DEFAULT_EPHEMERAL
    });

    await sock.relayMessage(jid, msgs.message, { messageId: msgs.key.id });
  } else {
    await sock.sendNCarousel(jid, ...messages[0], quoted, options);
  }
}
