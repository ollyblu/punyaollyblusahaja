const fetch = require('node-fetch')
const fs = require('fs')
handler = {
    main: async function(dt,pesan){
        pesan.reply('Mencari...')
        let res = JSON.parse(fs.readFileSync('./app/library/renungan.json'))
        let json = pickRandom(res)
        console.log(json)
        server.MessageMedia.fromUrl(json).then(async media=>{
            await server.client.sendMessage(pesan.from,media)
        })
    },
    command: /renungan/i,
    help: 'renungan',
    tags: ['quotes']
}
module.exports = handler