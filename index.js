require('dotenv').config({ path: 'variable.env' });
const http = require('http');
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);
const { get } = require('axios');
let url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/';
let definition = '';
let examples = '';

const server = http.createServer((req, res) => {
  res.end('Telegram Bot is Live 🔥');
});

bot.on('/hello', msg => {
  return bot.sendMessage(
    msg.from.id,
    `Hello 👋, ${
      msg.from.first_name
    }!I am your Telegram Word Assistant (TWA) - a wordtastic bot that helps you with the meaning of any word, right within Telegram.
    Try it out - send me a vocabulary you want to know its meaning.😉
    (c) 2018.  Developed by Oluwasetemi
    `,
    { notification: true, webPreview: true }
  );
});

bot.on('text', msg => {
  let word = msg.text.trim().toLowerCase();
  if (word !== '/hello') {
    get(`${url}${word}`, {
      headers: {
        app_id: process.env.APPID,
        app_key: process.env.APPKEY,
      },
    })
      .then(response => {
        console.log('working');
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
            `📚Definition: ${definition} \n 🆒Examples: ${examples} \n`
          );
        } else {
          return bot.sendMessage(
            msg.from.id,
            `Could you please search for another word!!${word} cannot be found in my brain.  🆒 I am so very cool 😭 \n`
          );
        }
      })
      .catch(err => {
        console.log(err.message);
        return bot.sendMessage(
          msg.from.id,
          `Could you please search for another word!!**${word}** cannot be found in my brain.  🆒 I am so very cool 😭 \n`
        );
      });
  }
});

bot.start();

server.listen(80, err => {
  if (!err) {
    console.log('server is listening on port 80');
  }
});
