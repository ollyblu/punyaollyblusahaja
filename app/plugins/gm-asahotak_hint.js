handler = {}
handler.main = async (dt,pesan) => {
    let id = dt.room_id
    let json = server.room[id].asahotak[1]
    let hint = ['…','‾','⁘','_']
    let ranhint = Math.floor(Math.random() * hint.length)
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g, hint[ranhint])
    pesan.reply(`Clue: *${clue}*\nPoin berkurang${100-game.clue*100}%`)
    server.room[id].asahotak[2]*= game.clue
}
handler.command = /clue/i
handler.child = 'asahotak'
handler.limit = true
module.exports = handler