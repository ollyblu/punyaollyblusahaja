const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game tebaklirik')
            clearTimeout(server.room[id].tebaklirik[3])
            delete server.room[id].tebaklirik
            delete server.room[id].child
        }else if(/clue/.test(pesan.body)){
            let clue = server.room[id].tebaklirik[1]
            clue = clue.jawaban.replace(/[AIUEOaiueo]/g, '_')
            pesan.reply(`Clue\n`+'```'+clue+'``` \nPoin berkurang 60%')
            server.room[id].tebaklirik[2]*= 0.4
        }
        return 0
    }
    let json = server.room[id].tebaklirik[1]
    if(pesan.body.toLowerCase()==json.jawaban.toLowerCase()){
        let bonus = server.room[id].tebaklirik[2]
        pesan.reply(`Wih benar\nBonus: ${bonus}`)
        dt.usr.poinG += bonus
        clearTimeout(server.room[id].tebaklirik[3])
        delete server.room[id].tebaklirik
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase())> threshold){
        pesan.react('❌')
        dt.usr.poinG -= Math.floor(server.room[id].tebaklirik[2]* 0.05)

    }
    else {
        pesan.react('❌')
        dt.usr.poinG -= Math.floor(server.room[id].tebaklirik[2]* 0.1)
    }
}
handler.child = 'tebaklirik'
//handler.tags = ['game']
module.exports = handler