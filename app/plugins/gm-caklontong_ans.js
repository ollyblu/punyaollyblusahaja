const similarity = require('similarity')
const threshold = 0.72
handler ={}
handler.all = async function(dt,pesan){
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game caklontong')
            clearTimeout(server.room[dt.room_id].caklontong[2])
            delete server.room[dt.room_id].caklontong
            delete server.room[dt.room_id].child
        }
        return 0
    }
    //console.log('cak -')
    let json = JSON.parse(JSON.stringify(server.room[dt.room_id].caklontong[1]))
    if(pesan.body.toLowerCase() == json.jawaban.toLowerCase().trim()){
        pesan.reply(`Wih benar\n${json.deskripsi}`)
        dt.usr.poinG += server.room[dt.room_id].caklontong[3]
        clearTimeout(server.room[dt.room_id].caklontong[2])
        delete server.room[dt.room_id].caklontong
        delete server.room[dt.room_id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase().trim())>=threshold){
        //pesan.reply('Ayok dikit lagi')
        await pesan.react(game.dikitlagi)
        dt.usr.poinG -= Math.floor(server.room[dt.room_id].caklontong[3]*game.dikit)
    }
    else {
        //pesan.reply(`Salah\nWaktu Tersisa: ${Math.floor(( server.room[dt.room_id].caklontong[2]._idleTimeout - (Date.now() - server.room[dt.room_id].caklontong[3]))/ 1000)}detik`)
        await pesan.react('❌')
        dt.usr.poinG -= Math.floor(server.room[dt.room_id].caklontong[3]*game.salah)
    }
}
handler.tags = ['game']
handler.child = 'caklontong'
module.exports = handler