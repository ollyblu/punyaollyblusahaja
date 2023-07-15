handler ={}
'◯○◻–—_…‾¯‗_—–-⁘'
handler.main = async(pesan)=>{
    let json = server.room[server.room_id].caklontong[1]
    let hint = ['…','‾','⁘','_']
    let ranhint = Math.floor(Math.random() * hint.length)
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g,hint[ranhint] )
    pesan.reply(`Clue: *${clue}*`)
}
handler.command = /clue/i
handler.room = 'game'
handler.child = 'caklontong'

module.exports = handler