const axios  =require('axios')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
handler = {}
handler.main = async function(dt,pesan){
    //if(pesan.author)return pesan.reply('Hanya bisa personal chat')
    if(dt.args.length<2)return pesan.reply(this.help)
    let text = dt.args[1]
    await pesan.reply('Hayo igel...')
    axios.get(`https://magneum.vercel.app/api/hentai?q=${text}`).then(async function (response) {
        //console.log(response.data);
        const data = response.data
        toRealUrl(data.meta.url).then(async (url)=>{
            if(!url)return 1
            media = await server.MessageMedia.fromUrl(url)
            console.log('media downloaded',url)
            await fs.writeFileSync(`./app/temp/magneum/${url.split('/')[url.split('/').length-1].split('?')[0]}`,media.data,{encoding: 'base64'})
            await server.client.sendMessage(pesan.from,media,{caption:url,isViewOnce: false})
            delete media
        }).catch(reason =>{
            pesan.reply('Reason: '+reason+'\n'+data.meta.url)
        })
        //pesan.reply(data.meta.url)
    }).catch(function (error) {
        //console.error(error);
        pesan.reply('Error\nReason'+error)
    });
}
handler.help = 'magneum|(ass, bdsm, blowjob, cum, doujin, feet, femdom, foxgirl, hentai\
    netorare, maid, masturbation, orgy, panties, pussy, school, succubus,\
    tentacles, thighs, uglyBastard, uniform, yuri)'
handler.command = /magneum/i
handler.disabled = false
module.exports = handler
