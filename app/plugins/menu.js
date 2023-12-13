let moment = require('moment-timezone')
const util = require('util')
const similarity = require('similarity')
moment.locale('id')
const defaultMenu ={
    before:`
┌─〔 %me 〕
├ *%ucapan %name*
│
├ BOT AKTIF : *%uptime*
├ Total pengguna : %totalreg
├ Tanggal: *%week %weton, %date*
├ Waktu Server : *%time*
├ Waktu (WIB) : %WIB
├ *%npmname V.%version*
└────

%readmore`.trim(),
header: '┌─〔 %category 〕',
body: '├ %cmd %islimit %isPremium',
footer: '└────\n',
after: `
${'```%npmdesc```'}
`
}
handler ={}
handler.main = async(dt,pesan)=>{
  let sender = dt.sender
    try{
    let tags
    tags = {
        'top':'Top Fitur',
        'game':'Game',
        'internet':'Internet',
        'info':'Informasi',
        'quotes':'Quotes',
        'translate':'Translate',
        'tools':'Alat',
        'buku':'Bacaan',
        'kerang':'Kerang Ajaib'
    }
    if(dt.args.length>1){
      let tag = Object.keys(tags).find(prdc=> similarity(prdc,dt.args[1])>0.5||similarity(tags[prdc],dt.args[1])>0.5)
      //if(tag)tags = Object.values(tags)[tag]
      let ntags = {}
      for(key in tags)
        if(key == tag)
          ntags[key] = tags[key]
      tags = ntags
      //if(tag)tags = tags[tag]
      console.log('filteres',tags)
    }
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let Waktu = moment(new Date)
    let WIB = Waktu.tz('Asia/Jakarta').format('HH:mm')
    //let WITA = Waktu.tz('Asia/Makassar').format('HH:mm')
    //let WIT = Waktu.tz('Asia/Jayapura').format('HH:mm')
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let time = d.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
    }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    global.jam = time
    let totalreg = Object.keys(global.db.users.data).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).filter(plugin => !plugin.child).map(plugin => {
        return {
          help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
          tags: Array.isArray(plugin.room) ? plugin.room : Array.isArray(plugin.tags)?plugin.tags : plugin.room,
          prefix: 'customPrefix' in plugin,
          limit: plugin.limit,
          premium: plugin.premium,
          enabled: !plugin.disabled,
        }
      })
      let groups ={}
      for (let tag in tags) {
        groups[tag] = []
        for (let plugin of help)
          if (plugin.room && plugin.room.includes(tag))
            if (plugin.help) groups[tag].push(plugin)
      }
    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after
    let _text = [
        before,
        ...Object.keys(tags).map(tag => {
            return header.replace(/%category/g, tags[tag]) + '\n' + [
              ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                return menu.help.map(help => {
                  return body.replace(/%cmd/g, menu.prefix ? help : '.' + help)
                    .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                    .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                    .trim()
                }).join('\n')
              }),
              footer
            ].join('\n')
          }),
          after
    ].join('\n')
    let replace = {
        '%':'%',
        ucapan: ucapan(),
        me: bot.name,
        uptime: muptime,
        name: `@${sender.split('@')[0]}`,
        totalreg,week,weton,date,time,WIB,
        npmname: 'Version',
        version: '2.1.0',
        readmore:'',
        npmdesc: 'Terimakasih'
    }
    //let text = typeof server.menu == 'string'?server.menu:typeof server.menu == 'object'?_text:''
    let text = _text
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let contact = {
        id:{
            _serialized: `${sender}`
        }
    }
    //console.log(text)
    try{
      if(0&&extension&&extension.ads){
        media = await server.MessageMedia.fromFilePath(extension.ads.your_ads_here.dir)
          await server.client.sendMessage(pesan.from,media,{caption:text,mentions:[contact]})
        delete media
      }else{
        await server.client.sendMessage(pesan.from,text,{mentions:[contact]})
      }
    }catch(err){console.error(err)}
    }catch(e){
        let text= `Maaf @${sender.split('@')[0]}, menu sedang error`
        let contact = {
            id:{
                _serialized: `${sender}`
            }
        }
        let obj ={}
        
        await server.client.sendMessage(pesan.from,text,{mentions:[contact]})
        await server.client.sendMessage(pesan.from,e.name+e.message)
    }
}
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
  }
function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    res = "Ga turu?"
    if (time >= 4) {
      res = "Sarapan euy"
    }
    if (time > 10) {
      res = "Push rank kuy"
    }
    if (time >= 15) {
      res = "Ngantuk"
    }
    if (time >= 18) {
      res = "Ganggu aja"
    }
    return res
}
handler.help = 'menu'
handler.tags = ['main']
handler.command = /^(m(enu)?|help|\?)$/i
module.exports = handler