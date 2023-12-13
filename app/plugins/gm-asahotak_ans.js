const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function (dt,pesan) {
    let id = dt.room_id
    if(server.identifier.includes(pesan.body.charAt(0))){
        if(keluarroom.test(pesan.body)){
            pesan.reply('Keluar dari room game asahotak')
            clearTimeout(server.room[id].asahotak[3])
            delete server.room[id].asahotak
            delete server.room[id].child
        }
        return 0
    }
        let json = JSON.parse(JSON.stringify(server.room[id].asahotak[1]))
        if (pesan.body.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            //global.db.data.users[m.sender].exp += this.asahotak[id][2]
            //await this.sendButton(m.chat, benar + ` +${this.asahotak[id][2]} XP`, wm, 'Lagi?', '.asahotak', m)
            pesan.reply(`*Benar*`)
            clearTimeout(server.room[id].asahotak[3])
            delete server.room[id].asahotak
            delete server.room[id].child
        } else if (similarity(pesan.body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold){
            //pesan.reply('Ayok dikit lagi')
            await pesan.react('❌')
            dt.usr.poinG -= Math.floor(server.room[id].asahotak[2]*game.dikit)
        }
        else{
            //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].asahotak[3]._idleTimeout - (Date.now() - server.room[id].asahotak[4]))/ 1000)}detik`)
            await pesan.react('❌')
            dt.usr.poinG -= Math.floor(server.room[id].asahotak[2]*game.salah)
    }
    return !0
}
handler.exp = 0
handler.tags = ['game']
handler.child = 'asahotak'
module.exports = handler
