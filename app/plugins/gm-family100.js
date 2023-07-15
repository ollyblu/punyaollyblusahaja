let fs = require('fs')
const winScore = 500
const timeout = 300000
handler = {}
handler.main = async function(pesan){
    if(typeof pesan.author == 'undefined')return pesan.reply('Game ini hanya tersedia di group')
    let id = server.room_id
    if(typeof server.room[id].child !== 'undefined'){
        if(server.room[id].child == 'family100'){
            pesan.reply('Masih ada kuis yang belum terjawab di chat ini')
            return 0
        }
        pesan.reply(`Chat ini masih diruang game ${server.room[id].child}`)
        return 0
    }
    let src = JSON.parse(fs.readFileSync('./app/library/family.json'))
    let json = src[Math.floor(Math.random()*src.length)]
    let caption = `*Soal:* ${json.soal}\n\nTerdapat *${json.jawaban.length}* jawaban teratas\n${json.jawaban.find(v => v.includes(' '))?'(Beberapa jawaban mengandung spasi)':''}\n\n+${winScore} XP tiap jawaban benar\nTimeout: ${timeout/1000} detik`.trim()
    server.room[id].child = 'family100'
    server.room[id].name = 'game'
    server.room[id].family100 = {
        id,
        msg: await pesan.reply(caption),
        ...json,
        terjawab: Array.from(json.jawaban,()=>false),
        winScore,
        tout: setTimeout(()=>{
            pesan.reply(`Waktu Habis\nTidak menerima jawaban lagi\n->${json.jawaban.join('\n->')}`)
            delete server.room[id].family100
            delete server.room[id].child
        },timeout)
    }
}
handler.help = 'family100'
handler.room = 'game'
handler.command = /family100?/i
module.exports = handler