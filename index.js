require('dotenv').config({path: 'variable.env'});
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);
const { get } = require('axios');
let url = 'https://googledictionaryapi.eu-gb.mybluemix.net/?define';
let definition = '';
let examples = '';
let synonyms = '';


try {
    bot.on('/hello', (msg) => {
        return bot.sendMessage(msg.from.id,
            `Hello 👋, ${ msg.from.first_name}!I am your Telegram Word Assistant (TWA) - a wordtastic bot that helps you with the meaning of any word, right within Telegram.
        Try it out - send me a vocabulary you want to know its meaning.😉
        (c) 2018.  Developed by Oluwasetemi
    `, {notification: true, webPreview: true});
    });

    bot.on('text', (msg) => {
        let word = msg.text.trim().toLowerCase();
        console.log(word);
        get(`${url}=${word}`).then(function (response) {
            console.log('it worked');
            if (response.status === 200) {
                const {data} = response;
                let meaning = Object.values(data)[2];
                for (let i in meaning ) {

                    definition = meaning[i][0].definition;
                    examples = meaning[i][0].example;
                    synonyms = meaning[i][0].synonyms;
                }
                /* let definition = data.meaning[0][0]['definition'];
                let examples = data.meaning[0][0]['example'];
                let synonyms = data.meaning['adjective'][0]['synonyms']; */
                return bot.sendMessage(msg.from.id, `Definition: ${definition} \n Examples: ${examples} \n Synonyms: ${synonyms}`);
            }

        }).catch((err) => {
            console.log(err.description);
            // return bot.sendMessage(msg.from.id, err);
        });
    });

    bot.start();
} catch (err) {
    console.log(err);
    console.log('Telegram cloud down');
}