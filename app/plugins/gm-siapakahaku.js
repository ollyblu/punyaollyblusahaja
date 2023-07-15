const fs = require('fs')
const fetch = require('node-fetch')
const timeout = 120000
const poin = 500
handler = {}
handler.main = async (pesan) => {
    let id = server.room_id
    if (typeof server.room[id].child !== 'undefined') {
        if (server.room[id].child == 'siapakahaku') {
            pesan.reply(`Masih ada soal yang belum terjawab di chat ini`)
            return false
        }
        pesan.reply('Kamu Sedang berada di room game lainnya')
        return false
    }
    let res = JSON.parse(fs.readFileSync('./app/library/siapakahaku.json'))
    let random = Math.floor(Math.random() * res.length)
    let json = res[random]
    let caption = `${json.soal}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik *!clue* untuk bantuan
Bonus: ${poin} XP
    `.trim()
    server.room[id].name = 'game'
    server.room[id].child = 'siapakahaku'
    server.room[id].siapakahaku = [
        pesan.reply(caption),
        json,
        poin,
        setTimeout(() => {
            if (server.room[id].siapakahaku) {
                pesan.reply(`Waktu Habis\nJawabannya adalah *${json.jawaban}*`)
                delete server.room[id].siapakahaku
                delete server.room[id].child
            }
        }, timeout),
        Date.now()
    ]
}
handler.help = 'siapakahaku'
handler.room = 'game'
handler.command = /^siapa(kah)?aku/i

module.exports = handler