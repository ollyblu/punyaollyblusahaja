handler = {}
handler.example = 'menfess-conversation (6289669811294) Halo kak aku orang yang akan mengajakmu bicara'
handler.main = async function(dt,pesan){
    server.room.big = server.room.big || {}
    if(pesan.author)return pesan.reply('Fitur ini tidak bisa digunakan di group')
    let lawan = pesan.body.slice(pesan.body.search(/\(/)+1,pesan.body.search(/\)/))
    if(lawan == bot.number)return pesan.reply('Kamukan udah bicara sama aku secara private 😏😋')
    if(lawan.length < 8)throw pesan.reply('Nulis nomor yang bener kamu anj') + await pesan.react(server.emoticon.marah[1])
    let pesanpertama = pesan.body.slice(pesan.body.search(/\)/)+1)
    let id = 'menfess_' + Date.now()
    while(pesanpertama.startsWith(' '))pesanpertama = pesanpertama.slice(1)
    console.log(lawan)
    if(Object.values(server.room.big).find(room => room.peserta && room.peserta.includes(lawan+'@c.us'))){
        pesan.reply('Orang yang kamu ajak bicara sedang sibuk :( \nSaya akan memintanya untuk meluangkan waktu')
        server.client.sendMessage(`${lawan}@c.us`,`Hai kamu\nAda seseorang yang ingin berbicara denganmu apakah kamu bisa meluangkan waktu sebentar?\n${pesanpertama}`)
    }else{
        pesan.reply('menunggu permintaan')
        server.client.sendMessage(`${lawan}@c.us`,`Hai\nAda sesorang yang ingin berbicaraa denganmu\nBisakah kamu meluangkan sedikit waktumu?\n${pesanpertama}`)
    }
    server.room.big[id] = {
        peserta : [pesan.from,lawan+'@c.us'],
        status: 'wait'
        
    }
}
//handler.room = 'menfess'
handler.tags = ['top']
handler.help = 'menfess-conversation'
handler.command = /menfess-con/
handler.disable = 1
module.exports = handler