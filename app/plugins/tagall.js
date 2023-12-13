handler = {}
const fs = require('fs')
const util = require('util')
handler.main = async function(dt,pesan){
    if(!pesan.author)return pesan.reply('Fitur hanya bisa di group')
    let group = await pesan.getChat()
    let pos = pesan.body.indexOf('|')
    let msg = ''
    if(pos>6)msg = pesan.body.slice(pos+1)
    //pesan.reply(util.format(contact))
    let participants = group.groupMetadata.participants
    let text = ''
    for(let fcon in participants){
        //console.log(participants[fcon])
        text+= `Halo @${participants[fcon].id.user}${msg}\n`
    }
    server.client.sendMessage(pesan.from,text,{mentions:participants})
}
handler.command = /tagall/i
module.exports = handler
