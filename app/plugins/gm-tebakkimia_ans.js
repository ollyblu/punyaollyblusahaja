const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game tebakkimia')
            clearTimeout(server.room[id].tebakkimia[3])
            delete server.room[id].tebakkimia
            delete server.room[id].child
        }else if(/clue/.test(pesan.body)){
            let clue = server.room[id].tebakkimia[1]
            clue = clue.unsur.replace(/[AIUEOaiueo]/g, '_')
            pesan.reply(`Clue\n`+'```'+clue+'``` \nPoin berkurang '+`${100 - game.clue*100}%`)
            server.room[id].tebakkimia[2]*= game.clue
        }
        return 0
    }
    let json = server.room[id].tebakkimia[1]
    if(pesan.body.toLowerCase()==json.unsur.toLowerCase()){
        let bonus = server.room[id].tebakkimia[2]
        pesan.reply(`Wih benar\nBonus: ${bonus}`)
        dt.usr.poinG += bonus
        clearTimeout(server.room[id].tebakkimia[3])
        delete server.room[id].tebakkimia
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.unsur.toLowerCase())> threshold){
        //pesan.reply(`Ayok dikit lagi`)
        pesan.react('❎')
        dt.usr.poinG -= Math.floor(server.room[id].tebakkimia[2]* game.dikit)

    }
    else {
        //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].susunkata[3]._idleTimeout - (Date.now() - server.room[id].susunkata[4]))/ 1000)}detik`)
        pesan.react('❌')
        dt.usr.poinG -= Math.floor(server.room[id].tebakkimia[2]* game.salah)
    }
}
handler.child = 'tebakkimia'
//handler.tags = ['game']
module.exports = handler