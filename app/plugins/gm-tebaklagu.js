const fetch = require('node-fetch')
const fs = require('fs')
timeout = 180000
poin = 500
handler = {}
handler.main = async function(dt,pesan){
    let id = dt.room_id
    if(!pesan.author)return pesan.reply('Hanya bisa digunakan di grup')
    if(server.room[id].child){
        if(server.room[id].child == 'tebaklagu'||server.room[id].tebaklagu)
        return pesan.reply('Masih ada soal yang belum terjawab di chat ini')
        return pesan.reply('Kamu Sedang berada di room lainnya\nHarap keluar dengan *.exit* untuk beralih kesini')
    }
    let res = JSON.parse(fs.readFileSync('./app/library/tebaklagu.json'))
    let random = Math.floor(Math.random() * res.length)
    let json = res[random]
    let media
    try{
    media = await server.MessageMedia.fromUrl(json.lagu)
    }catch(e){throw e}
    let caption = `
TEBAK JUDUL LAGU 
Artis : ${json.artis}
Judul : _____
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *.clue* untuk bantuan
Bonus: ${poin} XP`.trim()
let mssg = await server.client.sendMessage(pesan.from,media)
    mssg.reply(caption)
    server.room[id].name = 'game'
    server.room[id].child = 'tebaklagu'
    server.room[id].tebaklagu = [
    mssg,
    json,
    poin,
    setTimeout(() => {
        if (server.room[id].tebaklagu){
            if(server.room[id].child == 'tebaklagu')pesan.reply(`Waktu habis!\nJawabannya adalah *${json.judul}*`)
            delete server.room[id].tebaklagu
            delete server.room[id].child
        }
    }, timeout),
    Date.now()
    ]
    delete media
}
handler.help = 'tebaklagu'
handler.tags = ['game']
handler.command = /tebaklagu/
module.exports = handler