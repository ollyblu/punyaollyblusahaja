const chalk = require("chalk")
const generate = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')
global.isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))
const v8 = require('v8')
const util = require('util')
const os = require('os')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
global.template = require('./library/template.json')
global.game ={
    salah: 0.05,
    mulai: 0.1,
    clue: 0.6,
    dikit: 0.03,
    dikitlagi:'❎',
    salahlah:'❌',
    proses: function(poin,nilai){return typeof Math.floor(poin*nilai)=='number'?Math.floor(poin*nilai):1}
}
const MessageMedia = require('./apiwhatsapp')
const { options} = require("yargs")
server.identifier = ['!', '.', '#', '$']
server.pemisah = [' ','|','~','<','>','+']
server.nResp = /(\/|\/\/|,)/
server.emoticon = {
    bingung: ['🤨', '😇', '🙏🏻', '🥲', '🙂', '🫡', '🤔', '🥱', '😴', '😮‍💨', '🥴'],
    bingunglah:function(){return this.bingung[Math.floor(Math.random()*this.bingung.length)]},
    marah: ['🤬','😡']
}

//let identifier = /!|.|_|#|/i
module.exports = {
    async handler(chatUpdate) {
        let pesan = "message"
        let dt ={}
        pesan = chatUpdate.body
        if(chatUpdate.from == 'status@broadcast')return 0
        if(chatUpdate.body.length <2)return 0
        dt.chat = await chatUpdate.getChat()
        dt.id = Date.now()
        dt.room_id = dt.chat.isGroup ? dt.chat.groupMetadata.creation : dt.chat.id.user
        dt.sender = chatUpdate.author || chatUpdate.from
        let sender = chatUpdate.author || chatUpdate.from
        if (typeof server.room[dt.room_id] == 'undefined') {
            server.room[dt.room_id] = {
                name: 'home',
                timeout: undefined,
                child: undefined,
                process:[]
            }
        }
        server.room[dt.room_id].process.push(dt.id)
        if(server.room[dt.room_id].process.length>5)chatUpdate.reply('jangan spam ngab:(')
        while(server.room[dt.room_id].process.findIndex(pred=>pred==dt.id))
        if (server.nResp.exec(pesan.slice(0, 2))) return 0
            dbLoad()
            // let command = server.identifier.includes(pesan.charAt(0))
            // if (command) {
            //     let startC = pesan.search(' ')
            //     if (pesan.split(' ').length == 1) {
            //         command = pesan.slice(1)
            //     } else if (startC == 1) {
            //         command = pesan.split(' ')[1]
            //     } else if(startC >2){
            //         command = pesan.split(' ')[0].slice(1)
            //         dt.args = pesan.split(' ').slice(2)
            //     }
            //     //command = pesan.charAt(1)==' '?pesan.split(' ')[1]:pesan.split(' ')[0].slice(1)
            // } else {
            //     dt.args[0] = pesan
            // }
            //console.log(chalk.greenBright('command: ',command))
            let pemisah = server.pemisah.filter((pemisah)=>pesan.includes(pemisah))
            //console.log(pemisah) 
            while(pemisah.includes('|'))pemisah[pemisah.indexOf('|')]=' '
            while(pesan.includes('|'))pesan = pesan.replace('|',' ')
            while(pemisah.includes('+'))pemisah[pemisah.indexOf('+')]=' '
            while(pesan.includes('+'))pesan = pesan.replace('+',' ')
            const pemisahbaru = pemisah.filter((item, index) => pemisah.indexOf(item) === index);
            //console.log(pemisah)
            //console.log(pemisahbaru.join('|'))
            dt.args = []
            if(pemisah.length>0)
                dt.args = pesan.split(RegExp(`[${pemisahbaru.join('|')}]`))
            //dt.args = pesan.split(' ')
            else dt.args[0] = pesan
            //console.log(dt.args)
            let command = server.identifier.includes(dt.args[0].charAt(0))|chatUpdate.body.endsWith('?')|chatUpdate.body.endsWith('!')
            if(dt.args[0].length<2 && command)dt.args = dt.args.slice(1)
            if(command){
                command = dt.args[0]
                if(server.identifier.includes(command.charAt(0)))
                command = command.slice(1)
            }
                //console.log(dt.args)
            if(command){
                console.log(chalk.blueBright(command))
                console.log(dt.args)
            }

            try {
                let user = global.db.users.data[sender]
                if (typeof user == 'undefined' && !dt.chat.isGroup) {
                    let replace = {
                        '%': '%',
                        name: `@${sender.split('@')[0]}`,
                        ucapan: ucapan(),
                        me: bot.name
                    }
                    let text = global.template.welcome
                    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
                    let contact = {
                        id: {
                            _serialized: `${sender}`
                        }
                    }
                    console.log(text)
                    await server.client.sendMessage(chatUpdate.from, text.toString(), { mentions: [contact] })
                    //await pesan.reply(text,{caption:[contact]})
                }
                if (typeof user !== 'object') global.db.users.data[sender] = {}
                if (user) {
                    if (!isNumber(user.level)) user.level = 1
                    if (!isNumber(user.exp)) user.exp = 0
                    if (!isNumber(user.limit)) user.limit = 70
                    if (!isNumber(user.poinG)) user.poinG = 0
                    if (!isNumber(user.money)) user.money = 0
                    if (!('banned' in user)) user.banned = false
                    if (!('premium' in user)) user.premium = false
                    if (!isNumber(user.premiumTime)) user.premiumTime = 0
                } else {
                    global.db.users.data[sender] = {
                        level: 1,
                        exp: 0,
                        limit: 70,
                        poinG: 0,
                        money: 0,
                        banned: false,
                        premium: false,
                        premiumTime: 0,
                        gender:'Unknown'
                    }
                }
                dt.usr = global.db.users.data[chatUpdate.author || chatUpdate.from]
                let room = global.db.room.data[dt.room_id]
                if (typeof room !== 'object') global.db.room.data[dt.room_id] = {}
                if (room) {
                    if (!('game' in room)) room.game = false
                } else global.db.room.data[dt.room_id] = {
                    game: 0
                }
            } catch (e) { console.log(e) }
            let command_found = false
            let err = false
            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin) continue
                if (plugin.disabled) continue
                if ((plugin.room && server.room[dt.room_id].name !== plugin.room && server.room[dt.room_id].name !== 'home')) continue
                //console.log(name)
                if (plugin.child && plugin.child !== server.room[dt.room_id].child) continue
                //if(plugin.child && plugin.child[0] !== server.room[dt.room_id].child)continue
                if (typeof plugin.all === 'function')
                    try {
                        await plugin.all(dt,chatUpdate)
                        continue
                    } catch (e) {
                        if(typeof e == 'string')chatUpdate.reply(e)
                        else await chatUpdate.reply(`Mohon maaf terdapat error pada perintah tersebut`)
                        console.log('catch', e)
                        let text = util.format(e)
                        if (e.name) {
                            let contact = {
                                id: {
                                    _serialized: `${sender}`
                                }
                            }
                            await server.client.sendMessage(`${bot.owner}@c.us`, `*Plugin:* ${name}\n*Sender:* @${sender.split('@')[0]}\n*Chat:* ${dt.room_id}\n*Command:* ${pesan} ${dt.args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), { mentions: [contact] })
                        }
                        //server.client.sendMessage(`${bot.owner}@c.us`,`Terdapat kesalahan pada ${name}\n${e.toString()}`)
                    }
                if (!command) continue
                if (!plugin.command) continue
                if (!plugin.command.exec(command)) continue
                //console.log(plugin.child,server.room[dt.room_id].child)
                if (typeof plugin.main !== 'function') continue
                try {
                    //console.log(name)
                    await chatUpdate.react('⏳')
                    await plugin.main(dt,chatUpdate)
                    command_found = true
                    break
                    //plugin.handler(chatUpdate)
                } catch (e) {
                    if(typeof e == 'string')chatUpdate.reply(e)
                    if (e) {
                        let text = util.format(e)
                        while(text.includes(__dirname))text = text.replace(__dirname,'Google:\\app')
                        if (e.name) {
                            let contact = {
                                id: {
                                    _serialized: `${sender}`
                                }
                            }
                            chatUpdate.reply(`Mohon maaf terdapat error pada perintah tersebut\n Fungsi tersebut akan dihapus`)
                            await server.client.sendMessage(`${bot.owner}@c.us`, `*Plugin:* ${name}\n*Sender:* @${sender.split('@')[0]}\n*Chat:* ${dt.room_id}\n*Command:* ${plugin.command}: ${dt.args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), { mentions: [contact] })
                            await server.client.sendMessage(chatUpdate.from, `*Plugin:* ${name}\n*Sender:* @${sender.split('@')[0]}\n*Chat:* ${dt.room_id}\n*Command:* ${plugin.command}: ${dt.args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), { mentions: [contact] })
                            delete global.plugins[name]
                        }
                        //await chatUpdate.reply(e.toString())
                        err = true
                    }
                }
            }
            if (!command_found && command)
                await chatUpdate.react(server.emoticon.bingung[Math.floor(Math.random() * server.emoticon.bingung.length)])
            dt.usr.poinG = Math.floor(dt.usr.poinG)
            if(dt.usr.poinG<0)dt.usr.poinG*= -1
            //else if(!err)await chatUpdate.react('')
            //await chatUpdate.react('😇🙏🏻')
            if(server.room[dt.room_id].process[0] != dt.id)console.log('Tidak sama')
            server.room[dt.room_id].process.shift()
            
    },
    startsWithIdentifier(array, pesan) {
        let iden = 0
        for (let i in array)
            iden += pesan.startsWith(i)
        return iden
    },
    qr(data) {
        generate.generate(data, { small: true })
    },
    authenticated() {
        console.log(chalk.greenBright('Authentication...'))
    },
    async ready() {
        console.log(chalk.greenBright('API Ready...'))
        let IpAddress
        const defaulInterface = os.platform()=='win32'?'Ethernet':'eth0'
        const interfaces = os.networkInterfaces()[defaulInterface]
        for(const iface in interfaces){
            if (iface.family === 'IPv4' && iface.internal) {
                IpAddress = iface.address;
              }
        }
        let contactt = {
            id: {
                _serialized: `${bot.owner[0]}@c.us`
            }
        }
        await server.client.sendMessage(`${bot.owner}@c.us`,`Halo @${bot.owner}\n${bot.name} Telah Diaktifkan\nIpAddress: ${IpAddress}\nJumlah user: ${Object.keys(db.users.data).length}`,{mentions:[`${bot.owner[0]}@c.us`]})
        //server.client.sendMessage()
        // let res = require('./library/waifu.json')
        // let image = res[Math.floor(Math.random()*res.length)]
        // console.log(chalk.redBright(image))
        // let options = {
        //     caption: `Halo @${bot.owner}\n${bot.name} Telah Diaktifkan\nJumlah user: ${Object.keys(db.users.data).length}`,
        //     mentions: [contact]
        // }
        // message = await server.MessageMedia.fromUrl(image)
        // await server.client.sendMessage(`${bot.owner}@c.us`,message,options)
        // delete options
        // delete message
    },
    auth_failure(reason) {
        console.error('AUTHENTICATION FAILURE', reason);
    },
    disconnected(reason) {
        console.error('AUTHENTICATION FAILURE', reason);
    },
    loading_screen(percent, message) {
        console.log('loading' + percent + message)
    },
    changestate(state){
        console.log(state)
    },
    async message_create(msg) {
        if (typeof msg.body !== 'string') {
            console.log(chalk.redBright(`Cannot send message ${typeof msg}`))
            return false
        }
        let utcDate = new Date(msg._data.t * 1000); // Konversi timestamp menjadi objek Date UTC
        let Timestamp = new Date(utcDate.getTime()).toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'})
        if (msg.fromMe) {
            if(msg.body.endsWith('@c.us'))
            console.log(chalk.blueBright(Timestamp), '=>', chalk.yellowBright(msg.to), ':', chalk.greenBright(msg.body))
            else
            console.log(chalk.blueBright(Timestamp), '=>', chalk.yellowBright(msg.to), ':', chalk.greenBright(msg.body))
            if(server.identifier.includes(msg.body.charAt(0)))
            msg.from = msg.to
            //this.handler(msg)
        } else {
            if(!msg.author)
            console.log(chalk.blueBright(Timestamp), '=>', chalk.yellowBright(msg.from), ':', chalk.redBright(msg.body))
            else
            console.log(chalk.blueBright(Timestamp), '=>', chalk.greenBright(msg.from), ':', chalk.redBright(msg.body))
        }
        if (msg.body.split(' ')[0] == '!dataC') {
            let message = JSON.stringify(msg)
            msg.reply(message)
            fs.writeFile('msgC.json', message, 'utf-8', (error) => {
                console.error(error)
            })
        }
        if (msg.body.split(' ')[0] == '!gChat') {
            let message = JSON.stringify(await msg.getChat())
            msg.reply(message)
            fs.writeFile('msgC.json', message, 'utf-8', (error) => {
                console.error(error)
            })
        }
        if (msg.body.split(' ')[0] == '!gChat2') {
            let message = JSON.stringify(await server.client.getChats())
            msg.reply(message)
            fs.writeFile('msgC.json', message, 'utf-8', (error) => {
                console.error(error)
            })
        }
        if (msg.body.split(' ')[0] == '!gChat3') {
            let message = JSON.stringify(await server.client.getNumberId(msg.author || msg.from))
            msg.reply(message)
            fs.writeFile('msgC.json', message, 'utf-8', (error) => {
                console.error(error)
            })
        }
        if(msg.body.startsWith('!grupc')){
            let grup = await msg.getChat()
            fs.writeFile('gchats.json',JSON.stringify(grup),'utf-8',console.error)
        }
    },
    async message_(msg) {

        if (msg.body === '!buttons') {
            //let button = new Buttons('ISI',[{body:'apacoba'}], 'JUDUL', 'DESKRIPSI');
            //const button = new Buttons("Hello Button", [{ id: 1, body: 'Sí' }, { id: 2, body: 'No' }], 'Hello', 'Example');
            msg.reply(`fungsi button ilegal digunakan kecuali owner membayar pada pihak meta`);
        }
        if (msg.body === '!mention') {
            const chat = await msg.getChat();
            const contact = await msg.getContact();
            await chat.sendMessage(`Hello @${contact.id.user}`, { mentions: [contact] });
            console.log(chalk.greenBright(contact.id.user))
            console.log(contact)
        }
        if (msg.body == '!gchat') {
            const chat = await msg.getChat()
            let Jchat = JSON.stringify(chat)
            fs.writeFile('chat.json', Jchat, 'utf-8', (error) => console.error(error))
            msg.reply(Jchat)
            //console.log(chat)
        }
        if (msg.body.split(' ')[0] == '!datam') {
            let message = JSON.stringify(msg)
            msg.reply(message)
            fs.writeFile('mmsg.json', message, 'utf-8', (error) => {
                console.error(error)
            })
        }
        if (msg.body == '!plugin') {
            for (let name in global.plugins) {
                console.log(chalk.green(name))
            }
        }
        if (msg.body == '!img') {
            let message = "Coba kirim gambar"
            let image = "https://veja.abril.com.br/wp-content/uploads/2022/09/Teletubbies.jpeg"
            options = {
                caption: message,
            }
            //message = await server.MessageMedia.fromUrl(image)
            message = await server.MessageMedia.fromFilePath(`${__dirname}/image/Erika.jpg`)

            await server.client.sendMessage(msg.from, message, options);
            delete message
        }
        if (msg.body == '!memory') {
            var memoryUsage = process.memoryUsage();
            let rss = (memoryUsage.rss / 1024).toString()
            let Total = (memoryUsage.heapTotal / 1024).toString()
            let used = Math.floor((memoryUsage.heapUsed / 1024)).toString()
            let external = Math.floor((memoryUsage.external / 1024)).toString()
            var heapStatistics = v8.getHeapStatistics();
            var totalHeapSizeInKB = Math.round(heapStatistics.total_heap_size / 1024);
            console.log(totalHeapSizeInKB + ' KB');
            var usedHeapSizeInKB = Math.round(heapStatistics.used_heap_size / 1024);
            console.log(usedHeapSizeInKB + ' KB');
            let caption = `RSS: ${rss}\nTotal: ${Total}\nDigunakan: ${used}\nExternal: ${external}`
            await server.client.sendMessage(msg.from, caption)
        }
        this.handler(msg)
    },
    consoleToWa(data) {
        server.client.sendMessage(`${bot.owner}@c.us`, data)
    }
}
let file = require.resolve(__filename)
fs.watchFile(file, async () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    delete require.cache[file]
    if (global.reloadHandler) console.log(await global.reloadHandler())
})

global.listkatakotor = /k(o?a)ngk(o?a)ng|yat(e?i)m|ancrit|bokep| anj(k|g)|sundala| ajn?(g|k)| a?njin(g|k)|bajingan|cabul|lonte|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|gay|lesbi|asshole| asu|babi| tai$/i
global.keluarroom = /quit|keluar|close|minggat|exit|pergi/i
function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    res = "Selamat dinihari"
    if (time >= 4) {
        res = "Selamat pagi"
    }
    if (time > 10) {
        res = "Selamat siang"
    }
    if (time >= 15) {
        res = "Selamat sore"
    }
    if (time >= 18) {
        res = "Selamat malam"
    }
    return res
}
global.reloadRoom = function reloadRoom(id) {
    if (typeof server.room[id] == 'undefined') {
        server.room[id] = {
            name: 'home',
            timeout: undefined,
            child: undefined
        }
    } else if (typeof server.room[id].timeout !== 'undefined') {
        clearTimeout(server.room[id].timeout)
        delete server.room[id]
        reloadRoom(id)
    }
}
global.clockEmot = function(inputTime) {
    //console.log(inputTime)
    const [hour, minute,second] = inputTime.split('-')
    const hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);
    const roundedHour = Math.floor(hourInt%12);
    const emotMap = [  '🕛', '🕜', '🕐', '🕝', '🕑', '🕞', '🕒', '🕟', '🕓', '🕠',  '🕔', '🕡', '🕕', '🕢', '🕖', '🕣', '🕗', '🕤', '🕘', '🕥',  '🕙', '🕦', '🕚', '🕧']
    //console.log((roundedHour>=12?roundedHour-12:roundedHour) * 2 + (minuteInt >= 30 ? 1 : 0))
    return emotMap[(roundedHour>=12?roundedHour-12:roundedHour) * 2 + (minuteInt >= 30 ? 1 : 0)];
  }
global.toRealUrl = async function(url){
    return new Promise((resolve,reject)=>{
        fetch(url)
  .then(response => {
    response.text()
    resolve(response.url)
})
//   .then(html => {
//     const $ = cheerio.load(html);
//     const redirectScript = $('script').filter((i, el) => {
//       return $(el).html().includes('window.location.href');
//     });
//     console.log(redirectScript)
//     if (redirectScript.length > 0) {
//       const regex = /window\.location\.href\s*=\s*["']([^"']+)["']/;
//       const match = redirectScript.html().match(regex);
//       if (match && match[1]) {
//         const originalImageUrl = match[1];
//         console.log('Link gambar asli:', originalImageUrl);
//         resolve(originalImageUrl)
//         // Anda dapat melakukan sesuatu dengan URL gambar asli di sini
//       } else {
//         console.log('Tidak dapat menemukan URL gambar asli.');
//       }
//     } else {
//       console.log('Tidak ada skrip redirect dalam konten.');
//     }
//     reject(undefined)
//   })
  .catch(error => {
    console.error('Terjadi kesalahan:', error);
    reject(error)
  });
    })
    
}
global.parseObject = function (arr) {
    if(typeof arr == 'object'){
        for(let obj in arr){
            arr[obj] = parseObject(arr[obj])
        }
    }
    if (Array.isArray(arr) && arr.length === 1) {
      return arr[0];
    }
    return arr;
  }
global.explainObject = function (obj, parentKey = "") {
    let result = "";
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          const nestedObject = explainObject(obj[key], newKey);
          result += nestedObject;
        } else {
          result += `${newKey} = ${obj[key]}\n`;
        }
      }
    }
  
    return result;
  }
global.pickRandom = function(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}