require('dotenv').config();
const http = require('http');
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);
const { get } = require('axios');
let url = 'https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/';
let definition = '';
let examples = '';

const server = http.createServer((req, res) => {
  res.end('Telegram Bot is Live 🔥');
});

bot.on('/hello', msg => {
  return bot.sendMessage(
    msg.from.id,
    `Hello 👋, ${msg.from.first_name}
    !I am your Telegram Word Assistant (TWA) - a wordtastic bot that helps you with the meaning of any word, right within Telegram.
    Try it out - send me a vocabulary you want to know its meaning.😉
    (c) 2018.  Developed by Oluwasetemi
    `,
    { notification: true, webPreview: true, }
  );
});

bot.on('text', async (msg) => {
  let word = msg.text.trim().toLowerCase();
  if (word !== '/hello' && word !== '/about') {
    try {
      const response = await get(`${url}${word}`, {
        headers: {
          app_id: process.env.APPID,
          app_key: process.env.APPKEY,
        },
      });

      if (response.status === 200) {
        const { data } = response;
        definition =
              data.results[0].lexicalEntries[0]['entries'][0].senses[0]
                .definitions[0] || 'no results';
        examples =
              data.results[0].lexicalEntries[0]['entries'][0].senses[0]
                .examples[0].text || 'no results';

        return bot.sendMessage(
          msg.from.id,
          `
          Here is the result for ${word.toUpperCase()}
          \n📚Definition: ${definition}.\n
          \n🆒Examples: ${examples}.\n
          `
        );
      } else {
        return bot.sendMessage(
          msg.from.id,
          `Could you please search for another word!!${word} cannot be found in my brain.  🆒 I am so very cool 😭 \n`
        );
      }
    }
    catch (err) {
      // console.log(err.message);
      return bot.sendMessage(
        msg.from.id,
        `Could you please search for another word!!**${word}** cannot be found in my brain.  🆒 I am so very cool 😭 \n`
      );
    }
  }
});

bot.on('edit', msg => {
  return msg.reply.text('I saw it! You edited message!', { asReply: true });
});

// On command "about"
bot.on('/about', function(msg) {
  let text = `😽 This bot is powered by TeleBot library \n
    https://github.com/kosmodrey/telebot Go check the source code!
    \n It was written in Nodejs and can be you dictionary go to app within Telegram. Maintained and Developed by @Oluwasetemi!
    Hosted on openode as an opensource project.
    `;

  return bot.sendMessage(msg.chat.id, text);
});

bot.start();

server.listen(process.env.PORT || 4000, err => {
  if (!err) {
    console.log(`server is listening on port http://localhost:${process.env.PORT || 4000}`);
  }
});
