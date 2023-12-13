let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file,()=>{
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
global.APIs = { // API Prefix
    // name: 'https://website'
    nrtm: 'https://nurutomo.herokuapp.com',
    bg: 'http://bochil.ddns.net',
    xteam: 'https://api.xteam.xyz',
    zahir: 'https://zahirr-web.herokuapp.com',
    zeks: 'https://api.zeks.me',
    pencarikode: 'https://pencarikode.xyz',
    LeysCoder: 'https://leyscoders-api.herokuapp.com',
    neoxr: 'https://neoxr-api.herokuapp.com',
    amel: 'https://melcanz.com',
    hardianto: 'https://hardianto.xyz',
    lol: 'https://api.lolhuman.xyz',
    adicug: 'https://api.adiofficial.xyz',
    males: 'https://malest.herokuapp.com'
  }
  global.APIKeys = { // APIKey Here
    // 'https://website': 'apikey'
    'https://neoxr-api.herokuapp.com': 'apikeylu',
    'https://api.xteam.xyz': 'apikeylu',
    'https://melcanz.com': 'apikeylu',
    'https://api.lolhuman.xyz': 'apikeylu',
    'https://zahirr-web.herokuapp.com': 'apikeylu',
    'https://api.zeks.me': 'apikeylu',
    'https://pencarikode.xyz': 'apikeylu',
    'https://hardianto.xyz': 'hardianto',
    'https://leyscoders-api.herokuapp.com': 'apikeylu',
    'https://api.adiofficial.xyz': 'apikeylu'
  }

function pickRandom(list){
    return list[Math.floor(list.length*Math.random())]
}

global.config = {}
config.wait = '_*𝚜𝚎𝚍𝚊𝚗𝚐 𝚍𝚒 𝚙𝚛𝚘𝚜𝚎𝚜...*_'
config.eror = '_*𝚖𝚊𝚊𝚏 𝚜𝚎𝚛𝚟𝚎𝚛 𝚜𝚎𝚍𝚊𝚗𝚐 𝚊𝚍𝚊 𝚔𝚎𝚜𝚊𝚕𝚊𝚑𝚊𝚗 𝚝𝚎𝚔𝚗𝚒𝚜...*_'

