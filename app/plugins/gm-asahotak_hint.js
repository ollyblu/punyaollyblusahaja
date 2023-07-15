handler = {}
handler.main = async (pesan) => {
    let id = server.room_id
    let json = server.room[id].asahotak[1]
    let hint = ['…','‾','⁘','_']
    let ranhint = Math.floor(Math.random() * hint.length)
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g, hint[ranhint])
    pesan.reply(`Clue: *${clue}*`)
}
handler.command = /clue/i
handler.room = 'game'
handler.child = 'asahotak'
handler.limit = true
module.exports = handler