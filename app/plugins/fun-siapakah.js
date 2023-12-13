handler = {}
handler.main = async function(dt,pesan){
    if(!pesan.author)return 0
    let participant = dt.chat.groupMetadata.participants
    participant = participant.filter(item =>item.id._serialized.split('@')[0] !== bot.number.toString())
    let target = participant[Math.floor(Math.random()*participant.length)]
    server.client.sendMessage(pesan.from,`@${target.id._serialized.split('@')[0]}`,{mentions:[target]})
}
handler.help = 'siapakah _kalimat_?'
handler.command = /siapakah/i
handler.tags = ['kerang']

module.exports = handler