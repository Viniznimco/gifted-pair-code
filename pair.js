
const { giftedid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { Storage, File } = require("megajs");

const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("gifted-baileys");

function randomMegaId(length = 6, numberLength = 4) {
                      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let result = '';
                      for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                       const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                        return `${result}${number}`;
                        }

async function uploadCredsToMega(credsPath) {
    try {
        const storage = await new Storage({
  email: '', // // Your Mega A/c Email Here
  password: '' // Your Mega A/c Password Here
}).ready
        console.log('Mega storage initialized.');
        if (!fs.existsSync(credsPath)) {
            throw new Error(`File not found: ${credsPath}`);
        }
       const fileSize = fs.statSync(credsPath).size;
        const uploadResult = await storage.upload({
            name: `${randomMegaId()}.json`,
            size: fileSize
        }, fs.createReadStream(credsPath)).complete;
        console.log('Session successfully uploaded to Mega.');
        const fileNode = storage.files[uploadResult.nodeId];
        const megaUrl = await fileNode.link();
        console.log(`Session Url: ${megaUrl}`);
        return megaUrl;
    } catch (error) {
        console.error('Error uploading to Mega:', error);
        throw error;
    }
}
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = giftedid();
    let num = req.query.number;
    async function SNAPDRAGON_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Gifted = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari")
            });
            if (!Snapdragon.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Snapdragon.requestPairingCode(num);
                console.log(`Your Code: ${code}`);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Snapdragon.ev.on('creds.update', saveCreds);
            Snapdragon.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    const filePath = __dirname + `/temp/${id}/creds.json`;
                    if (!fs.existsSync(filePath)) {
                        console.error("File not found:", filePath);
                        return;
                    }

          const megaUrl = await uploadCredsToMega(filePath);
          const sid = megaUrl.includes("https://mega.nz/file/")
            ? 'Snapdragon~' + megaUrl.split("https://mega.nz/file/")[1]
            : 'Error: Invalid URL';
          
          console.log(`Session ID: ${sid}`);

                    const session = await Snapdragon.sendMessage(Snapdragon.user.id, { text: sid }, { disappearingMessagesInChat: true, ephemeralExpiration: 600, });

                    const SNAPDRAGON_TEXT = `
*✅sᴇssɪᴏɴ ɪᴅ ɢᴇɴᴇʀᴀᴛᴇᴅ✅*
______________________________
╔════◇
║『 𝐘𝐎𝐔'𝐕𝐄 𝐂𝐇𝐎𝐒𝐄𝐍 SNAPDRAGON 𝐌𝐃 』
║ You've Completed the First Step
║ to Deploy a Whatsapp Bot.
╚══════════════╝
╔═════◇
║ 『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ 𝐓𝐮𝐭𝐨𝐫𝐢𝐚𝐥: _youtube.com/@giftedtechnexus_
║❒ 𝐎𝐰𝐧𝐞𝐫: _https://t.me/snapdragon_
║❒ 𝐑𝐞𝐩𝐨: _https://github.com/Viniznimco/SNAPDRAGON-JET-MD_
║❒ 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥: _https://whatsapp.com/channel/0029Vb6jFwj89ine3b7qHB1y_
║ 💜💜💜
╚══════════════╝ 
 𝗚𝗜𝗙𝗧𝗘𝗗-𝗠𝗗 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 5.𝟬.𝟬
______________________________

Use your Session ID Above to Deploy your Bot.
Check on YouTube Channel for Deployment Procedure(Ensure you have Github Account and Billed Heroku Account First.)
Don't Forget To Give Star⭐ To My Repo`;
                    await Snapdragon.sendMessage(Snapdragon.user.id, { text: SNAPDRAGON_TEXT }, { quoted: session },  { disappearingMessagesInChat: true, ephemeralExpiration: 600, });

                    await delay(100);
                    await Snapdragon.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    SNAPDRAGON_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error("Service Has Been Restarted:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service is Currently Unavailable" });
            }
        }
    }

    return await SNAPDRAGON_PAIR_CODE();
});

module.exports = router;
