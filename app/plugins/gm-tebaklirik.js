const fs = require('fs')
const poin = 500
handler = {}
handler.main = async function(dt,pesan){
    let id = dt.room_id
    if(server.room[id].child){
        return pesan.reply(`Kamu sedang berada di room ${server.room[id].child}`)
    }else if(server.room[id].child == 'tebaklirik')return pesan.reply('Masih ada soal yang belum terjawab')
    let res = JSON.parse(fs.readFileSync('./app/library/tebaklirik.json'))
    let json = pickRandom(res)
    let caption = `*${json.soal}*\nWaktu: ${timeout/1000}detik\nKetik *!clue* untuk bantuan
`.trim()
    dt.usr.poinG -= Math.floor(dt.usr.poinG>poin*game.mulai?poin*game.mulai:-poin*game.salah)
    server.room[id].child = 'tebaklirik'
    server.room[id].tebaklirik=[
        pesan.reply(caption),
        json,
        poin,
        setTimeout(()=>{
            if(server.room[id].tebaklirik)pesan.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*`)
            delete server.room[id].tebaklirik
            delete server.room[id].child
            //reloadRoom(id)
        },timeout)
    ]
}
handler.command = /tebaklirik/i
handler.help = 'tebaklirik'
handler.tags = ['game']
module.exports = handler 