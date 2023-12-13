handler = {}
handler.main = async (dt,pesan) => {
    let id = dt.room_id
    let json = server.room[id].siapakahaku[1]
    let clue = json.jawaban.replace(/[AIUEOaiueo]/g, '_')
    server.room[id].siapakahaku[2] *= game.clue 
    pesan.reply('Clue: ```' + `${clue}` +'``` '+`\nPoin menjadi ${server.room[id].siapakahaku[2]}`)
}
handler.command = /clue/i
handler.tags = ['game']
handler.child = 'siapakahaku'
handler.limit = true
module.exports = handler