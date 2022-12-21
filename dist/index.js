import dotenv from 'dotenv';
import Discord from 'discord.js';
// import logger from "./logger";
import Recorder from './recorder.js';
dotenv.config();
class BOT {
    constructor() {
        this.registerEvents = () => {
            this.client.on('message', this.handleMessage);
            this.client.on('shardError', error => {
                console.error('A websocket connection encountered an error:', error);
            });
            process.on('unhandledRejection', error => {
                console.error('Unhandled promise rejection:', error);
            });
        };
        this.handleMessage = (message) => {
            var _a;
            // Checks if bot was mentioned
            if (this.client.user && message.mentions.has(this.client.user.id)) {
                const msg_split = message.content.split(' ');
                // If bot was mentioned without a command, then skip.
                if (!msg_split[1])
                    return;
                // const suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
                let command = msg_split[1].toLowerCase();
                if (command[0] === process.env.BOT_PREFIX)
                    command = command.slice(1);
                if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel))
                    return;
                console.log("heyyyyy");
                console.log(message.content);
                switch (command) {
                    case "join":
                        this.recorder.joinVoice(message.member.voice.channel);
                        break;
                    case "leave":
                        this.recorder.leaveVoice();
                        break;
                }
                return;
            }
        };
        this.client = new Discord.Client();
        this.recorder = new Recorder(this.client);
        this.client.once('ready', () => {
            // logger.info(`---- ${process.env.NODE_ENV?.toUpperCase()} ENVIRONMENT ----`)
            // logger.info(`Booting Discord Recorder BOT...`)
        });
        this.registerEvents();
        this.client.login(process.env.BOT_TOKEN);
    }
}
new BOT();
