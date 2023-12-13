handler = {}
handler.main = async function(dt,pesan){
    //let text = await explainObject(global.db.users.data[pesan.author || pesan.from])
    let text = await explainObject(dt.usr)
    pesan.reply(text)
}
handler.command = /infome/i
handler.help = 'infome'
handler.tags = ['info']
module.exports = handler