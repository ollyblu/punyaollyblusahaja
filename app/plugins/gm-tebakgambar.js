const fetch = require('node-fetch')
const fs = require('fs')
timeout = 180000
poin = 500
handler = {}
handler.main = async function(dt,pesan){
    let id = dt.room_id
    if(!pesan.author)return pesan.reply('Hanya bisa digunakan di grup')
    if(server.room[id].child){
        if(server.room[id].child == 'tebakgambar'||server.room[id].tebakgambar)
        return pesan.reply('Masih ada soal yang belum terjawab di chat ini')
        return pesan.reply('Kamu Sedang berada di room lainnya\nHarap keluar dengan *.exit* untuk beralih kesini')
    }
    let res = JSON.parse(fs.readFileSync('./app/library/tebakgambar.json'))
    let random = Math.floor(Math.random() * res.length)
    let json = res[random]
    let media = await server.MessageMedia.fromUrl(json.img)
    let caption = `
Timeout *${(timeout/1000).toFixed(2)} detik*
Ketik *!clue* untuk bantuan
Bonus: ${poin} XP`.trim()
    server.room[id].name = 'game'
    server.room[id].child = 'tebakgambar'
    server.room[id].tebakgambar = [
    server.client.sendMessage(pesan.from,media,{caption}),
    json,
    poin,
    setTimeout(() => {
        if (server.room[id].tebakgambar){
            if(server.room[id].child == 'tebakgambar')pesan.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*`)
            delete server.room[id].tebakgambar
            delete server.room[id].child
        }
    }, timeout),
    Date.now()
    ]
}
handler.help = 'tebakgambar'
handler.tags = ['game']
handler.command = /tebakgambar/
module.exports = handler