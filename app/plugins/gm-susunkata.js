const fs = require('fs')
const timeout = 120000
const poin = 500
handler = {}
handler.main = async function (dt,pesan) {
    let id = dt.room_id
    if (typeof server.room[id].child !== 'undefined') {
        if (server.room[id].child == 'susunkata') {
            pesan.reply(`Masih ada soal yang belum terjawab di chat ini`)
            return false
        }
        pesan.reply('Kamu Sedang berada di room game lainnya')
        return false
    }
    let res = JSON.parse(fs.readFileSync('./app/library/susunkata.json'))
    let random = Math.floor(Math.random() * res.length)
    let json = res[random]
    let caption = `Soal: ${json.soal}\nBerkaitan dengan ${json.tipe}\nTimeout: *${timeout / 1000}* detik\nBonus: ${poin}`
    server.room[id].name = 'game'
    server.room[id].child = 'susunkata'
    server.room[id].susunkata = [
        await pesan.reply(caption),
        json,
        poin,
        setTimeout(() => {
            pesan.reply(`Waktu habis\n Jawabannya adalah ${json.jawaban}`)
            delete server.room[id].susunkata
            delete server.room[id].child
        }, timeout),
        Date.now()
    ]
}
handler.tags = ['game']
handler.help = 'susunkata'
handler.command = /susunkata?/
module.exports = handler