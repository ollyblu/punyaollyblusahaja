const fs = require('fs')
const fetch = require('node-fetch')
const timeout = 120000
const poin = 500
handler = {}
handler.main = async (dt,pesan) => {
    let id = dt.room_id
    if(typeof server.room[id].child !== 'undefined'){
        if(server.room[id].child == 'asahotak' || server.room[id].asahotak){
            pesan.reply(`Masih ada soal belum terjawab di chat ini`)
            return false
        }
        pesan.reply('Kamu Sedang berada di room lainnya\nHarap keluar dengan *.exit* untuk beralih kesini')
        return false
    }
    let res = JSON.parse(fs.readFileSync('./app/library/asahotak.json'))
    let random = Math.floor(Math.random() * res.length)
    let json = res[random]
    let caption = `*${json.soal}*
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *!clue* untuk bantuan
    `.trim()
    server.room[id].name = 'game'
    server.room[id].child = 'asahotak'
    server.room[id].asahotak = [
    await pesan.reply(caption),
    json,
    poin,
    setTimeout(() => {
        if (server.room[id].asahotak){
            if(server.room[id].child == 'asahotak')pesan.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*`)
            delete server.room[id].asahotak
            delete server.room[id].child
        }
    }, timeout),
    Date.now()
    ]
}
handler.help = 'asahotak'
handler.tags = ['game']
handler.command = /^asahotak/i

module.exports = handler