let fs = require('fs')
let fetch = require('node-fetch')
let timeout = 120000
let poin = 500
handler ={}
handler.help = 'caklontong'
handler.room = 'game'
handler.command = /caklontong|cak|lontong/i
handler.main = async (pesan) => {
    let id = server.room_id
    if(typeof server.room[id].child !== 'undefined'){
        if(server.room[id].child == 'caklontong'){
            pesan.reply(`Masih ada soal yang belum terjawab\n${server.room[id].caklontong[1].soal}`)
            return false
        }
        pesan.reply('Kamu Sedang berada di room game lainnya')
        return false
    }
    let resource = JSON.parse(fs.readFileSync('./app/library/caklontong.json'))
    let random = Math.floor(Math.random() * resource.length)
    let json = resource[random]
    let caption = `*${json.soal}*\nWaktu: ${timeout/1000}detik\nKetik *!clue* untuk bantuan
`.trim()
    server.room[id].name = 'game'
    server.room[id].child = 'caklontong'
    server.room[id].caklontong=[
        pesan.reply(caption),
        json,
        setTimeout(()=>{
            if(server.room[id].caklontong)pesan.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*\n_${json.deskripsi}_`)
            delete server.room[id].caklontong
            delete server.room[id].child
            //reloadRoom(id)
        },timeout),
        Date.now()
    ]
}
module.exports = handler