const chalk = require("chalk")
const generate = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')
const moment = require('moment-timezone')
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))
const v8 = require('v8')
const util = require('util')
global.template = require('./library/template.json')
const MessageMedia = require('./apiwhatsapp')
server.identifier = ['!', '.', '_', '*', '#', '$']
server.nResp = /(\/|\/\/|,)/
server.emoticon = {
    bingung: ['🤨', '😇', '🙏🏻', '🥲', '🙂', '🫡', '🤔', '🥱', '😴', '😮‍💨', '🥴']
}

//let identifier = /!|.|_|#|/i
module.exports = {
    async handler(chatUpdate) {
        let pesan = "message"
        pesan = chatUpdate.body
        server.chat = await chatUpdate.getChat()
        server.room_id = server.chat.isGroup ? server.chat.groupMetadata.creation : server.chat.id.user
        server.sender = chatUpdate.author || chatUpdate.from
        if (typeof server.room[server.room_id] == 'undefined') {
            server.room[server.room_id] = {
                name: 'home',
                timeout: undefined,
                child: undefined
            }
        }
        if (!server.nResp.exec(pesan.slice(0, 2))) {
            dbLoad()
            let command = server.identifier.includes(pesan.charAt(0))
            let args = []
            if (command) {
                let startC = pesan.search(' ')
                if (pesan.split(' ').length == 1) {
                    command = pesan.slice(1)
                } else if (startC == 1) {
                    command = pesan.split(' ')[1]
                } else if(startC >2){
                    command = pesan.split(' ')[0].slice(1)
                    args = pesan.split(' ').slice(2)
                }
                //command = pesan.charAt(1)==' '?pesan.split(' ')[1]:pesan.split(' ')[0].slice(1)
            } else {
                args[0] = pesan
            }
            //console.log(chalk.greenBright('command: ',command))
            try {
                let user = global.db.users.data[server.sender]
                if (typeof user == 'undefined' && !chat.isGroup) {
                    let replace = {
                        '%': '%',
                        name: `@${server.sender.split('@')[0]}`,
                        ucapan: ucapan(),
                        me: bot.name
                    }
                    let text = global.template.welcome
                    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
                    let contact = {
                        id: {
                            _serialized: `${server.sender}`
                        }
                    }
                    console.log(text)
                    await server.client.sendMessage(chatUpdate.from, text.toString(), { mentions: [contact] })
                    //await pesan.reply(text,{caption:[contact]})
                }
                if (typeof user !== 'object') global.db.users.data[server.sender] = {}
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
                    global.db.users.data[server.sender] = {
                        level: 1,
                        exp: 0,
                        limit: 70,
                        poinG: 0,
                        money: 0,
                        banned: false,
                        premium: false,
                        premiumTime: 0
                    }
                }
                let room = global.db.room.data[server.room_id]
                if (typeof room !== 'object') global.db.room.data[server.room_id] = {}
                if (room) {
                    if (!('game' in room)) room.game = false
                } else global.db.room.data[server.room_id] = {
                    game: 0
                }
            } catch (e) { console.log(e) }
            let command_found = false
            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin) continue
                if (plugin.disable) continue
                if ((plugin.room && server.room[server.room_id].name !== plugin.room && server.room[server.room_id].name !== 'home')) continue
                //console.log(name)
                if (plugin.child && plugin.child !== server.room[server.room_id].child) continue
                //if(plugin.child && plugin.child[0] !== server.room[server.room_id].child)continue
                if (typeof plugin.all === 'function')
                    try {
                        await plugin.all(chatUpdate)
                        continue
                    } catch (e) {
                        await chatUpdate.reply(`Mohon maaf terdapat error pada perintah tersebut`)
                        console.log('catch', e)
                        let text = util.format(e)
                        if (e.name) {
                            let contact = {
                                id: {
                                    _serialized: `${server.sender}`
                                }
                            }
                            await server.client.sendMessage(`${bot.owner}@c.us`, `*Plugin:* ${name}\n*Sender:* @${server.sender.split('@')[0]}\n*Chat:* ${server.room_id}\n*Command:* ${pesan} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), { mentions: [contact] })
                        }
                        //server.client.sendMessage(`${bot.owner}@c.us`,`Terdapat kesalahan pada ${name}\n${e.toString()}`)
                    }
                if (!command) continue
                if (!plugin.command) continue
                if (!plugin.command.exec(command)) continue
                //console.log(plugin.child,server.room[server.room_id].child)
                if (typeof plugin.main !== 'function') continue
                try {
                    //console.log(name)
                    chatUpdate.react('⏳')
                    await plugin.main(chatUpdate)
                    command_found = true
                    break
                    //plugin.handler(chatUpdate)
                } catch (e) {
                    if (e) {
                        let text = util.format(e)
                        if (e.name) {
                            let contact = {
                                id: {
                                    _serialized: `${server.sender}`
                                }
                            }
                            chatUpdate.reply(`Mohon maaf terdapat error pada perintah tersebut\n Fungsi tersebut akan dihapus`)
                            await server.client.sendMessage(`${bot.owner}@c.us`, `*Plugin:* ${name}\n*Sender:* @${server.sender.split('@')[0]}\n*Chat:* ${server.room_id}\n*Command:* ${plugin.command}:${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), { mentions: [contact] })
                            delete global.plugins[name]
                        }
                        //await chatUpdate.reply(e.toString())
                    }
                }
            }
            if (!command_found && command)
                await chatUpdate.react(server.emoticon.bingung[Math.floor(Math.random() * server.emoticon.bingung.length)])
            else await chatUpdate.react('')
            //await chatUpdate.react('😇🙏🏻')
        }
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
    ready() {
        console.log(chalk.greenBright('API Ready...'))
        //server.client.sendMessage(`${bot.owner[0]}@c.us`,`${bot.name} diaktifkan`)
        let contact = {
            id: {
                _serialized: `${bot.owner[0]}@c.us`
            }
        }
        server.client.sendMessage(`${bot.owner}@c.us`, `Halo @${bot.owner}\n${bot.name} Telah Diaktifkan`, { mentions: [contact] })
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
    async message_create(msg) {
        if (typeof msg.body !== 'string') {
            console.log(chalk.redBright(`Cannot send message ${typeof msg}`))
            return false
        }
        const utcDate = new Date(msg._data.t * 1000); // Konversi timestamp menjadi objek Date UTC
        const jakartaOffset = 7 * 60 * 60 * 1000; // Offset waktu Jakarta dalam milidetik (7 jam = 7 * 60 * 60 * 1000)
        const Timestamp = new Date(utcDate.getTime() + jakartaOffset).toString();
        if (msg.fromMe) {
            console.log(chalk.blueBright(Timestamp), '=>', chalk.yellowBright(msg.to), ':', chalk.greenBright(msg.body))
        } else {
            console.log(chalk.blueBright(Timestamp), '=>', chalk.yellowBright(msg.from), ':', chalk.redBright(msg.body))
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

global.listkatakotor = /k(o?a)ngk(o?a)ng|yat(e?i)m|ancrit|bokep|anj(k|g)|sundala|ajn?(g|k)|a?njin(g|k)|bajingan|cabul|lonte|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|gay|lesbi|asshole/i
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