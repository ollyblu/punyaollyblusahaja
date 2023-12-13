const fs = require('fs')
const poin = 200
handler = {}
handler.main = async function(dt,pesan){
    let id = dt.room_id
    if(server.room[id].child){
        return pesan.reply(`Kamu sedang berada di room ${server.room[id].child}`)
    }else if(server.room[id].child == 'tekateki')return pesan.reply('Masih ada soal yang belum terjawab')
    let res = JSON.parse(fs.readFileSync('./app/library/tekateki.json'))
    let json = pickRandom(res)
    let caption = `*${json.soal}*\nWaktu: ${timeout/1000}detik\nBonus: ${poin}\nKetik *!clue* untuk bantuan
`.trim()
    dt.usr.poinG -= Math.floor(poin*game.mulai)
    server.room[id].child = 'tekateki'
    server.room[id].tekateki=[
        pesan.reply(caption),
        json,
        poin,
        setTimeout(()=>{
            if(server.room[id].tekateki)pesan.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*`)
            delete server.room[id].tekateki
            delete server.room[id].child
            //reloadRoom(id)
        },timeout)
    ]
}
handler.command = /tekateki/i
handler.help = 'tekateki'
handler.tags = ['game']
module.exports = handler 