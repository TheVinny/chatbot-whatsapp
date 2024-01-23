import { Client, LocalAuth } from 'whatsapp-web.js';

import qrcode from 'qrcode-terminal';
import 'dotenv/config';
import { ImageToStickerService } from './services/ImageToStickerService';
import { GetRandomDogStickerService } from './services/GetRandomDogStickerService';

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth(),
});

client.on('qr', qr => {
  console.log('QR CODE:___________________')
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');

  const number = process.env.PHONE_NUMBER;

  const text = 'Bot connectado';

  const chatId = number.substring(1) + '@c.us';

  client.sendMessage(chatId, text);
});

client.on('message', async msg => {
  if (msg.body == '!sticker') {
    await ImageToStickerService(msg);
  }

  if (msg.body == '!dog') {
    await GetRandomDogStickerService(msg);
  }
});

client
  .initialize()
  .then(() => console.log('inicializou'))
  .catch(err => console.log('error -> ' + err));
