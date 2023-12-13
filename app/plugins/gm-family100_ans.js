const similarity = require('similarity')
const threshold = 0.72

handler = {}
handler.all = async function(dt,pesan){
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(/exit|close|keluar|quit|minggat/i.test(pesan.body.slice(1))){
            pesan.reply('Keluar dari room family100')
            clearTimeout(server.room[id].family100.tout)
            delete server.room[id].family100
            delete server.room[id].child
            return 1
        }
        return 0
    }
    let room = server.room[id].family100
    let text = pesan.body.toLowerCase().replace(/[^\w\s-]+/,'')
    let isSurrender = (/nyerah|suren|males/i.test(pesan.body.toLowerCase()))
    if(!isSurrender){
        let index = room.jawaban.findIndex(v => similarity(v.toLowerCase().replace(/[^\w\s-]+/,''),text)>0.8)
        if (index < 0){
            if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => similarity(jawaban.trim(), text))) >= threshold){
                //pesan.reply(`Ayok dikit lagi`)
                pesan.react('❎')
                dt.usr.poinG -= game.proses(room.winScore,game.dikit)
                return !0
            }else {
                //pesan.reply(`Waduh tidak ada di survei\nCoba yang lain`)
                pesan.react('❌')
                //console.log(room.winScore,'dikali',game.salah)
                //console.log('pengurangan',game.proses(room.winScore,game.salah))
                dt.usr.poinG -= game.proses(room.winScore,game.salah)
                return true
            }
        }
        if(room.terjawab[index])return server.client.sendMessage(pesan.from,`Sudah dijawab oleh @${room.terjawab[index]}`,{mentions:[{id:{_serialized:`${room.terjawab[index]}@c.us`}}]})
        room.terjawab[index] = pesan.author.split('@')[0]
        dt.usr.poinG += room.winScore
    }
    let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
    let caption = `*Soal:* ${room.soal}\n\nTerdapat *${room.jawaban.length}* jawaban teratas${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*\n` : isSurrender ? '*MENYERAH!*\n' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
    return isSurrender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@'+room.terjawab[index] : ''}`.trim() : false
}).filter(v => v).join('\n')}
${isSurrender ? '' : `+${room.winScore} XP tiap jawaban benar`}`.trim()
    let mention = []
    for(let index=0;index<room.terjawab.length;index++){
        if(!room.terjawab[index])continue
        const obj ={
            id:{
                _serialized: `${room.terjawab[index]}@c.us`
            }
        }
        console.log(obj)
        mention.push(obj)
    }
    await server.client.sendMessage(pesan.from,caption,{mentions : mention})
    if(isWin || isSurrender){
        clearTimeout(server.room[id].family100.tout)
        delete server.room[id].family100
        delete server.room[id].child
        return 1
    }
}
handler.child = 'family100'
handler.tags = ['game']
module.exports = handler