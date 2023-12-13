const CryptoJS = require('crypto.js')
handler = {}
handler.main = function(dt,pesan){
    if(dt.args.length<4)return pesan.reply('Untuk mengenkripsi pesan ketik\n!encryptaes <panjang karakter kunci> <kunci> <teks>\nContoh\n!encryptaes 10 shadowsage Apacoba dicoba\n!encryptaes 10 pake nanya Apacoba dicoba')
    let panjangkunci = Number(dt.args[1])
    if(typeof panjangkunci !== 'number' || panjangkunci<1)return pesan.reply('Panjang karakter kunci haru angka >= 1')
    let kunci
    kunci = pesan.body.slice(pesan.body.indexOf(dt.args[1]),pesan.body.indexOf(dt.args[1])+panjangkunci+3)
    let teks = pesan.body.slice(pesan.body.indexOf(kunci)+panjangkunci+4)
    //let encrypted = 
    pesan.reply(encrypted)
    //console.log('panjang kunci','('+panjangkunci+')')
    //console.log('kunci','('+kunci+')')
    //console.log('teks','('+teks+')')

}
handler.command = /encryptaes/i
handler.help = 'encryptaes'
handler.tags = ['tools']
handler.disabled = true
module.exports = handler