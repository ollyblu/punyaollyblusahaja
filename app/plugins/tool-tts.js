//let gtts = require('node-gtts')
let googleTTS = require('google-tts-api')
let fs = require('fs')
let path = require('path')
let { spawn } = require('child_process')
const { reject } = require('lodash')

const defaultLang = 'id'
handler = {}
handler.main = async function (dt,pesan) {
  if(dt.args.length<2)return pesan.reply('Mana teksnya\nContoh\n !tts aku jawa')
  let lang = dt.args[1]
  let text = dt.args.slice(2).join(' ').toLowerCase().replace(listkatakotor, 'Gaboleh Kata Kata Kotor KK')
  if ((dt.args[1] || '').length !== 2) {
    lang = defaultLang
    text = dt.args.slice(1).join(' ').toLowerCase().replace(listkatakotor, 'Gaboleh Kata Kata Kotor KK')
  }
  if (!text && pesan.hasQoutedMsg&& await pesan.getQuotedMsg().body) text = await pesan.getQuotedMsg().body.toLowerCase  ().replace(listkatakotor, 'Gaboleh Kata Kata Kotor KK')

  let res
  if(text.length<40)
  try { 
    res = await tts(text, lang)
  }
  catch (e) {
    pesan.reply(e + '')
    //res = await tts(text)
  } finally { 
    //conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
    //console.log(res)
    let opt = {
      unsafeMime:true,
      //filename:'' 
    }
    server.MessageMedia.fromUrl(res[0].url,opt).then((media)=>{
      options = {
        sendAudioAsVoice:true
      }
      console.log(res[0].url)
      server.client.sendMessage(pesan.from,media,options).then(()=>delete media)
    }).catch((e)=>console.error(e))
  }
  else
  try{
    res = await longtts(text,lang)
  }catch(e){
    pesan.reply(e+'')
  }finally{
    let opt = {
      unsafeMime:true
    }
    for(idn in res){
      server.MessageMedia.fromUrl(res[idn].url,opt).then((media)=>{
        options = {
          sendAudioAsVoice:true
        }
        server.client.sendMessage(pesan.from,media,options).then(()=>delete media)
      }).catch((e)=>console.error(e))
    }
  }
}
handler.help = ['tts <lang> <teks>']
handler.tags = ['tools']
handler.command = /^g?tts$/i
module.exports = handler

function tts(text, lang = 'id') {
  console.log(lang, text)
  return new Promise((resolve, reject) => {
    try {
      let url = googleTTS.getAllAudioUrls(text,{
        lang:lang,
        slow:false,
        host:'https://translate.google.com'
      })
      resolve(url)
    } catch (e) { reject(e) }
  })
}
function longtts(text,lang = 'id'){
  console.log(lang,text)
  return new Promise((resolve,reject)=>{
    try{
      let url = googleTTS.getAllAudioUrls(text, {
        lang: lang,
        slow: false,
        host: 'https://translate.google.com',
        splitPunct: ',.?',
      });
      resolve(url)
    }catch(e){reject(e)}
  })
}
function ttsfile(text,lang = 'id'){
  console.log(lang,text)
  return new Promise((resolve,reject)=>{
    try{
      googleTTS.getAudioBase64('Hello World', {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
    timeout: 10000,
  }).then(resolve)
    }catch(e){reject(e)}
  })
}