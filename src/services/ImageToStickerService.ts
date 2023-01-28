import mime from 'mime';
import fs from 'fs';
import path from 'path';
import { Message, MessageMedia } from 'whatsapp-web.js';

export async function ImageToStickerService(msg: Message) {
  if (!msg.hasMedia) {
    msg.reply('Envie o comando acompanhado de uma imagem - BOT MESSAGE');
  }

  if (msg.hasMedia) {
    const media = await msg.downloadMedia();

    const type = mime.getExtension(media.mimetype);

    const allow = ['png', 'jpeg'];

    const isAllow = allow.find(i => i == type);

    if (!isAllow) {
      msg.reply('Tipo de arquivo ainda não permitdo');
      return;
    }

    fs.writeFileSync(
      `src/uploadSticker/${Date.now()}.${type}`,
      media.data,
      'base64',
    );

    const orderReccentFiles = async (dir: string) => {
      const readed = fs
        .readdirSync(dir)
        .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
        .map(file => ({
          file,
          mtime: fs.lstatSync(path.join(dir, file)).mtime,
        }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      return readed;
    };

    const getMostRecentFile = async (dir: string) => {
      const files = await orderReccentFiles(dir);
      const { file } = files.length ? files[0] : undefined;

      return file;
    };

    const file = await getMostRecentFile('src/uploadSticker/');

    const sticker = MessageMedia.fromFilePath('src/uploadSticker/' + file);

    await msg.reply(sticker, '', {
      sendMediaAsSticker: true,
    });

    fs.unlinkSync('src/uploadSticker/' + file);
  }
}
