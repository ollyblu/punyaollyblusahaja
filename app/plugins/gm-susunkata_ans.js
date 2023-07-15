const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function(pesan){
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game susunkata')
            clearTimeout(server.room[id].susunkata[3])
            delete server.room[id].susunkata
            delete server.room[id].child
        }
        return 0
    }
    let id = server.room_id
    let json = server.room[id].susunkata[1]
    if(pesan.body.toLowerCase()==json.jawaban.toLowerCase()){
        pesan.reply(`Wih benar\nBonus: ${server.room[id].susunkata[2]}`)
        clearTimeout(server.room[id].susunkata[3])
        delete server.room[id].susunkata
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase()))pesan.reply(`Ayok dikit lagi`)
    else pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].susunkata[3]._idleTimeout - (Date.now() - server.room[id].susunkata[4]))/ 1000)}detik`)
}
handler.child = 'susunkata'
handler.room = 'game'
module.exports = handler