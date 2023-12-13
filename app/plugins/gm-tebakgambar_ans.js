const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game tebakgambar')
            clearTimeout(server.room[id].tebakgambar[3])
            delete server.room[id].tebakgambar
            delete server.room[id].child
        }else if(/clue/.test(pesan.body)){
            let clue = server.room[id].tebakgambar[1]
            clue = clue.jawaban.replace(/[AIUEOaiueo]/g, '_')
            pesan.reply(`Clue\n`+'```'+clue+'```')
        }
        return 0
    }
    let json = server.room[id].tebakgambar[1]
    if(pesan.body.toLowerCase()==json.jawaban.toLowerCase()){
        dt.usr.poinG += server.room[id].tebakgambar[2]
        pesan.reply(`Wih benar\nBonus: ${server.room[id].tebakgambar[2]}`)
        clearTimeout(server.room[id].tebakgambar[3])
        delete server.room[id].tebakgambar
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase())){
        //pesan.reply(`Ayok dikit lagi`)
        dt.usr.poinG -= Math.floor(server.room[id].tebakgambar[3]*game.dikit)
        pesan.react('❌')
    }
    else {
        //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].susunkata[3]._idleTimeout - (Date.now() - server.room[id].susunkata[4]))/ 1000)}detik`)
        dt.usr.poinG -= Math.floor(server.room[id].tebakgambar[3]*game.salah)
        pesan.react('❌')
    }
}
handler.child = 'tebakgambar'
handler.tags = ['game']
module.exports = handler