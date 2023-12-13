handler = {}
handler.main = async function(dt,pesan){
    if(dt.args.length<2){
        return pesan.reply('Variabel apa yang ingin diubah?')
    }else if(dt.args.length<3){
        return pesan.reply('Berapa nilainya?')
    }
    if(typeof pengguna[dt.args[1]] == 'undefined')
    pengguna[dt.args[1]] = Number(dt.args[2])?Number(dt.args[2]):dt.args[2]
    else
    pengguna[dt.args[1]] = Number(dt.args[2])
    return pesan.reply(explainObject(pengguna))
}
handler.command = /cheat/i
handler.help = 'cheat'
module.exports = handler