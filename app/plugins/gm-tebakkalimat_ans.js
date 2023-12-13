const similarity = require('similarity')
const threshold = 0.52
handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game tebakkalimat')
            clearTimeout(server.room[id].tebakkalimat[3])
            delete server.room[id].tebakkalimat
            delete server.room[id].child
        }else if(/clue/.test(pesan.body)){
            let clue = server.room[id].tebakkalimat[1]
            clue = clue.jawaban.replace(/[AIUEOaiueo]/g, '_')
            pesan.reply(`${server.room[id].tebakkalimat[1].deskripsi}\nClue\n`+'```'+clue+'``` \nPoin menjadi '+`${game.clue*100}%`)
            server.room[id].tebakkalimat[2]*= game.clue
        }
        return 0
    }
    let json = server.room[id].tebakkalimat[1]
    if(similarity(pesan.body,json.jawaban.toLowerCase())>0.7){
        let bonus = server.room[id].tebakkalimat[2]
        pesan.reply(`Wih benar\nBonus: ${bonus}`)
        dt.usr.poinG += bonus
        clearTimeout(server.room[id].tebakkalimat[3])
        delete server.room[id].tebakkalimat
        delete server.room[id].child
    }else if(similarity(pesan.body.toLowerCase(),json.jawaban.toLowerCase())> threshold){
        //pesan.reply(`Ayok dikit lagi`)
        pesan.react('❎')
        dt.usr.poinG -= Math.floor(server.room[id].tebakkalimat[2]* game.dikit)

    }
    else {
        //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].susunkata[3]._idleTimeout - (Date.now() - server.room[id].susunkata[4]))/ 1000)}detik`)
        pesan.react('❌')
        dt.usr.poinG -= Math.floor(server.room[id].tebakkalimat[2]* game.salah)
    }
}
handler.child = 'tebakkalimat'
//handler.tags = ['game']
module.exports = handler