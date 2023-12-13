const fetch = require('node-fetch')
handler = {}
handler.main = async function(dt,pesan){
    fetch('https://masgi.herokuapp.com/api/cerpen').then(async(url)=>{
        let cerpen = await url.json()
        let hasil = `${cerpen.data}`.trim()
        pesan.reply(hasil)
    })
}
handler.command = /cerpen/
handler.help = 'cerpen'
handler.tags = ['quotes']
handler.disabled = true
module.exports = handler