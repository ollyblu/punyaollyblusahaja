handler ={}
'◯○◻–—_…‾¯‗_—–-⁘'
handler.main = async(dt,pesan)=>{
    let json = server.room[dt.room_id].caklontong[1]
    let hint = ['…','‾','⁘','_']
    let ranhint = Math.floor(Math.random() * hint.length)
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g,hint[ranhint] )
    server.room[dt.room_id].caklontong[3] *= 0.3
    pesan.reply(`Clue: *${clue}*\nPoin menjadi ${server.room[dt.room_id].caklontong[3]}`)
}
handler.command = /clue/i
handler.tags = ['game']
handler.child = 'caklontong'

module.exports = handler