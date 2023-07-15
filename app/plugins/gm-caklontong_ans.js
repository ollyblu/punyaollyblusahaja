const similarity = require('similarity')
const threshold = 0.72
handler ={}
handler.all = async function(pesan){
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game caklontong')
            clearTimeout(server.room[server.room_id].caklontong[2])
            delete server.room[server.room_id].caklontong
            delete server.room[server.room_id].child
        }
        return 0
    }
    //console.log('cak -')
    let json = JSON.parse(JSON.stringify(server.room[server.room_id].caklontong[1]))
    if(pesan.body.toLowerCase() == json.jawaban.toLowerCase()){
        pesan.reply(`Wih benar\n${json.deskripsi}`)
        clearTimeout(server.room[server.room_id].caklontong[2])
        delete server.room[server.room_id].caklontong
        delete server.room[server.room_id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase().trim())>=threshold)pesan.reply('Ayok dikit lagi')
    else pesan.reply(`Salah\nWaktu Tersisa: ${Math.floor(( server.room[server.room_id].caklontong[2]._idleTimeout - (Date.now() - server.room[server.room_id].caklontong[3]))/ 1000)}detik`)
}
handler.room = 'game'
handler.child = 'caklontong'
module.exports = handler