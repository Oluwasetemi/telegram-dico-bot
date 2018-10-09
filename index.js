require('dotenv').config({path: 'variable.env'});
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);


bot.on('text', (msg) => msg.reply.text(msg.text));

bot.start();