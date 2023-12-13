const fetch = require('node-fetch')
handler = {}
handler.main = async function(dt,pesan){
    let text = pesan.body.slice(pesan.body.indexOf('|')+1)
    console.log(text)
    let res = await fetch(global.API('https://covid19.mathdro.id', '/api/countries/'+ (text)))
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.confirmed) throw 'Negara?'
    if (json.confirmed) m.reply(`
Countries : ${text}
Confirmed : ${json.confirmed.value}
Recovered : ${json.recovered.value}
Deaths : ${json.deaths.value}
Last Update : ${json.lastUpdate}`.trim())
    else throw json
}
handler.help = 'covid|negara'
handler.tags = ['internet','info']
handler.command = /^(corona|covid|covid19)/
module.exports = handler