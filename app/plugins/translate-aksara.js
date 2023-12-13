const aksara = require('@sajenid/aksara.js')
handler = {}
handler.main = async function(dt,pesan){
    let pos = pesan.body.indexOf('|')
    if(pos<5)return pesan.reply('Apa yang ingin di translate?\nContoh\n!aksara|sekolah')
    let target = pesan.body.slice(pos)
    let hasil = aksara.LatinKeAksara(target)
    pesan.reply(hasil)
}
handler.help = 'aksara'
handler.command = /aksara|tr-aksara/
handler.tags = ['translate']
module.exports = handler