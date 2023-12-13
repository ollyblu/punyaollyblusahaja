const fs = require('fs')
const poin = 300
const timeout = 20000
handler = {}
handler.main = async function(dt,pesan){
    let id = dt.room_id
    if(server.room[id].child){
        return pesan.reply(`Kamu sedang berada di room ${server.room[id].child}`)
    }else if(server.room[id].child == 'tebakkimia')return pesan.reply('Masih ada soal yang belum terjawab')
    let res = JSON.parse(fs.readFileSync('./app/library/tebakkimia.json'))
    let json = pickRandom(res)
    let caption = `Apa Nama unsur dari lambang *${json.lambang}*\nWaktu: ${timeout/1000}detik\nBonus: ${poin}\nKetik *!clue* untuk bantuan
`.trim()
    dt.usr.poinG -= Math.floor(poin*game.mulai)
    server.room[id].child = 'tebakkimia'
    server.room[id].tebakkimia=[
        pesan.reply(caption),
        json,
        poin,
        setTimeout(()=>{
            if(server.room[id].tebakkimia)pesan.reply(`Waktu habis!\nJawabannya adalah *${json.unsur}*`)
            delete server.room[id].tebakkimia
            delete server.room[id].child
            //reloadRoom(id)
        },timeout)
    ]
}
handler.command = /tebakkimia/i
handler.help = 'tebakkimia'
handler.tags = ['game']
module.exports = handler 