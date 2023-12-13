const {kbbi} = require('../api/kbbi')
handler = {}
handler.main = async function(dt,pesan){
    let text = pesan.body.slice(pesan.body.indexOf('kbbi')+5)
    if(!text)return pesan.reply('Contoh :\n!kbbi aku')
    kbbi(text).then(res =>{
        let kbbi = JSON.stringify(res)
        let jjson = JSON.parse(kbbi)
        if(typeof err != 'undefined')return pesan.reply('Kata tidak ditemukan. :(')
        let caption = `${jjson.lema}\n\n${jjson.arti.join(', ')}`.trim()
        let a = 1;
        if(caption.includes('Anat')){
            caption.replace('Anat',`${a++}`)
        }
        pesan.reply(caption)
    }).catch((reason)=>{console.log('err',reason);pesan.reply(reason)})
}
handler.command = /kbbi/
handler.help= 'kbbi <kata>'
handler.tags = ['internet']
module.exports = handler