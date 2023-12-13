const similarity = require('similarity')
const threshold = 0.72
handler = {}
handler.all = async function (dt,pesan) {
  if(server.identifier.includes(pesan.body.charAt(0))){
    if(keluarroom.test(pesan.body)){
      pesan.reply('Keluar dari room game siapakahaku')
      clearTimeout(server.room[id].siapakahaku[3])
      delete server.room[id].siapakahaku
      delete server.room[id].child
    }
    return 0
  }
  let id = dt.room_id
  let json = JSON.parse(JSON.stringify(server.room[id].siapakahaku[1]))
  if (pesan.body.toLowerCase() == json.jawaban.toLowerCase()) {
    //global.db.data.users[m.sender].exp += this.siapakahaku[id][2]
    //this.sendButton(m.chat, benar + ` +${this.siapakahaku[id][2]} XP`, wm, 'Lagi', '.siapakahaku', m)
    dt.usr.poinG += server.room[id].siapakahaku[2]
    pesan.reply(`Wih benar\nBonus ${server.room[id].siapakahaku[2]}`)
    clearTimeout(server.room[id].siapakahaku[3])
    delete server.room[id].siapakahaku
    delete server.room[id].child
  } else if (similarity(pesan.body.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold){
    //pesan.reply('Ayok dikit lagi')
    dt.usr.poinG -= game.proses(server.room[id].siapakahaku[2],game.dikit)
    await pesan.react('❌')
  }
  else{
    //pesan.reply(`*Salah*\nWaktu terisisa: ${Math.floor(( server.room[id].siapakahaku[3]._idleTimeout - (Date.now() - server.room[id].siapakahaku[4]))/ 1000)}detik`)
    dt.usr.poinG -= game.proses(server.room[id].siapakahaku[2],game.salah)
    await pesan.react('❌')
  }
  return !0
}
handler.exp = 0
handler.tags = ['game']
handler.child = 'siapakahaku'
module.exports = handler
