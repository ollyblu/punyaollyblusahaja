handler = {}
handler.main = async (pesan) => {
    let id = server.room_id
    let json = server.room[id].siapakahaku[1]
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g, '_')
    pesan.reply('Clue: ```' + `${clue}` +'``` ')
}
handler.command = /clue/i
handler.room = 'game'
handler.child = 'siapakahaku'
handler.limit = true
module.exports = handler