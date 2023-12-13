const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game susunkata')
            clearTimeout(server.room[id].susunkata[3])
            delete server.room[id].susunkata
            delete server.room[id].child
        }
        return 0
    }
    let json = server.room[id].susunkata[1]
    if(pesan.body.toLowerCase()==json.jawaban.toLowerCase()){
        dt.usr.poinG += server.room[id].susunkata[2]
        pesan.reply(`Wih benar\nBonus: ${server.room[id].susunkata[2]}`)
        clearTimeout(server.room[id].susunkata[3])
        delete server.room[id].susunkata
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase())){
        //pesan.reply(`Ayok dikit lagi`)
        dt.usr.poinG -= Math.floor(server.room[id].siapakahaku[2],game.dikit)
        pesan.react('❌')
    }
    else {
        //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].susunkata[3]._idleTimeout - (Date.now() - server.room[id].susunkata[4]))/ 1000)}detik`)
        dt.usr.poinG -= Math.floor(server.room[id].siapakahaku[2],game.salah)
        pesan.react('❌')
    }
}
handler.child = 'susunkata'
handler.tags = ['game']
module.exports = handler