
handler = {}
const {Brainly} = require('brainly-scraper-v2')
const brain = new Brainly('id')
handler.main = async function(dt,pesan){
    let pos = pesan.body.indexOf('brainly')
    let text = pesan.body.slice(pos+8)
    if(pesan.body.charAt(pos+8)==''||!text)return pesan.reply('Soalnya?')
    //console.log(text)
    brain.search(text).then(async (res)=>{
        let jumlahjawaban = res.length
        //console.log(res)
        await pesan.reply(`Terdapat ${jumlahjawaban} Soal yang mirip\n\n_Mengirim soal dan jawaban......_`)
        for(let i=0;i<jumlahjawaban;i++){
            let Brains = `User : ${res[i].question.author.username?res[i].question.author.username:''}
Pertanyaan : ${res[i].question.content||''}
${res[i].answers[0].content ? 'Jawaban : '+res[i].answers[0].content:'Jawaban : Belum ada'}`
            await pesan.reply(Brains)
        }
    })
}
handler.help = ['brainly <soal>']
handler.tags = ['internet']
handler.command = /brainly/i
module.exports = handler