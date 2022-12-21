var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import moment from 'moment';
import wav from 'wav';
class Recorder {
    constructor(client) {
        this.leaveVoice = () => {
            var _a;
            // Leave the current voice channel if any
            try {
                (_a = this.voiceConnection) === null || _a === void 0 ? void 0 : _a.disconnect();
                // logger.info(`I left the ${this.voiceChannel?.name} channel.`)
                this.voiceConnection = undefined;
                this.voiceChannel = undefined;
                this.audioWriter = undefined;
            }
            catch (e) {
                console.log(e);
                return;
            }
        };
        this.joinVoice = (voiceChannel) => __awaiter(this, void 0, void 0, function* () {
            // Join the same voice channel of the author of the message
            try {
                this.voiceChannel = voiceChannel;
                this.voiceConnection = yield this.voiceChannel.join();
                // logger.info(`I joined the ${this.voiceChannel.name} channel.`)
                this.recordAudio();
            }
            catch (err) {
                console.error(err);
            }
        });
        this.recordAudio = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.voiceReceiver = (_a = this.voiceConnection) === null || _a === void 0 ? void 0 : _a.receiver;
            (_b = this.voiceConnection) === null || _b === void 0 ? void 0 : _b.on('debug', (debug) => {
                var _a, _b;
                // Try to decode the packet as media event
                try {
                    const packet = JSON.parse(debug.slice(8));
                    // Avoid some wrong edge cases
                    if (!packet.d || packet.d && packet.d.speaking != 1)
                        return;
                    const user = (_a = this.client) === null || _a === void 0 ? void 0 : _a.users.resolve(packet.d.user_id);
                    if (!this.audioWriter) {
                        // logger.info("Creating new media recording file in: " + `${process.env.MEDIA_OUTPUT_FOLDER}/${moment().format("YYYY-MM-DD_HHmmss")}-media-recording.wav`)
                        this.audioWriter = new wav.FileWriter(`${process.env.MEDIA_OUTPUT_FOLDER}/${moment().format("YYYY-MM-DD_HHmmss")}-media-recording.wav`);
                    }
                    // Record the speaking user
                    if (packet.d.speaking && user) {
                        this.userStream = (_b = this.voiceReceiver) === null || _b === void 0 ? void 0 : _b.createStream(user, { mode: 'pcm', end: 'manual' });
                        this.userStream.on('data', (chunk) => this.audioWriter.write(chunk));
                    }
                }
                catch (e) {
                    return;
                }
            });
        });
        this.client = client;
        this.voiceChannel = undefined;
        this.voiceConnection = undefined;
        this.voiceReceiver = undefined;
        this.userStream = undefined;
        this.audioWriter = undefined;
    }
}
export default Recorder;
