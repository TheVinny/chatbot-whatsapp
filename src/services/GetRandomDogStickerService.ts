import { Message, MessageMedia } from 'whatsapp-web.js';
import axios from 'axios';
import { DogResponse } from 'src/domains/interfaces/DogResponse';

export async function GetRandomDogStickerService(msg: Message) {
  const { data } = await axios.get<DogResponse>('https://random.dog/woof.json');

  if (data.url.includes('gif') || data.url.includes('mp4')) {
    console.log(data);
    await GetRandomDogStickerService(msg);
  }

  const sticker = await MessageMedia.fromUrl(data.url);

  await msg.reply(sticker, '', {
    sendMediaAsSticker: true,
  });
}
