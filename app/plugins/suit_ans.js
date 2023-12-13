handler = {}
handler.all = async function (dt,pesan) {
  //this.big = this.big ? this.big : {}
  //if (db.data.users[m.sender].big < 0) db.data.users[m.sender].big = 0
  server.room.big = server.room.big || {}
  //if(server.room[dt.room_id].child !== this.child)return 0
  let room = Object.values(server.room.big).find(room => room.id && room.status && room.peserta.includes(dt.sender))
  //console.log(room)
  if (room) {
    let win = ''
    let tie = false
    if (dt.sender == room.peserta[1] && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body) && pesan.author && room.status == 'wait') {
      if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body)) {
        server.client.sendMessage(pesan.from,`@${room.peserta[1].split`@`[0]} menolak suit, suit dibatalkan`,{mentions:[{id:{_serialized:room.peserta[1]}}]})
        delete server.room.big[room.id]
        return !0
      }
      room.status = 'play'
      room.asal = pesan.from
      clearTimeout(room.waktu)
      //delete room[room.id].waktu
      server.client.sendMessage(pesan.from,`Suit telah dikirimkan ke chat
@${room.peserta[0].split`@`[0]} dan 
@${room.peserta[1].split`@`[0]}

Silahkan pilih suit di chat masing"
klik wa.me/${bot.number}`,{mentions:[{id:{_serialized:room.peserta[0]}},{id:{_serialized:room.peserta[1]}}]})

      if (!room.pilih) server.client.sendMessage(room.peserta[0], `Silahkan ketik\n *Batu* / *Kertas* / *Gunting* \nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\nBonus +${room.poin_bot}`)
      if (!room.pilih2) server.client.sendMessage(room.peserta[1], `Silahkan ketik\n *Batu* / *Kertas* / *Gunting* \nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\nBonus +${room.poin_bot}`)
      room.waktu_milih = setTimeout(() => {
        if (!room.pilih && !room.pilih2) server.client.sendMessage(pesan.from, `Kedua pemain tidak niat main,\nSuit dibatalkan`)
        else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.peserta[1]:room.peserta[0]
          server.client.sendMessage(pesan.from, `@${(room.pilih ? room.peserta[1]:room.peserta[0]).split`@`[0]} tidak memilih suit, game berakhir`.trim(),{mentions:[{id:{_serialized:room.pilih ? room.peserta[1]:room.peserta[0]}}]})
          //db.data.users[win == room.peserta[0] ? room.peserta[0] : room.peserta[1]].exp += room.poin
          //db.data.users[win == room.peserta[0] ? room.peserta[0] : room.peserta[1]].exp += room.poin_bot
          //db.data.users[win == room.peserta[0] ? room.peserta[1] : room.peserta[0]].exp -= room.poin_lose
        }
        delete server.room.big[room.id]
        return !0
      }, room.timeout)
    }
    let jwb = pesan.from == room.peserta[0]
    let jwb2 = pesan.from == room.peserta[1]
    let g = /gunting/i
    let b = /batu/i
    let k = /kertas/i
    let reg = /^(gunting|batu|kertas)/i
    if (jwb && reg.test(pesan.body) && !room.pilih && !pesan.author) {
      room.pilih = reg.exec(pesan.body.toLowerCase())[0]
      room.text = pesan.body
      pesan.reply(`Kamu telah memilih ${pesan.body} ${!room.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih2) server.client.sendMessage(room.peserta[1], '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    if (jwb2 && reg.test(pesan.body) && !room.pilih2 && !pesan.author) {
      room.pilih2 = reg.exec(pesan.body.toLowerCase())[0]
      room.text2 = pesan.body
      pesan.reply(`Kamu telah memilih ${pesan.body} ${!room.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih) server.client.sendMessage(room.peserta[0], '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    let stage = room.pilih
    let stage2 = room.pilih2
    if (room.pilih && room.pilih2) {
      clearTimeout(room.waktu_milih)
      if (b.test(stage) && g.test(stage2)) win = room.peserta[0]
      else if (b.test(stage) && k.test(stage2)) win = room.peserta[1]
      else if (g.test(stage) && k.test(stage2)) win = room.peserta[0]
      else if (g.test(stage) && b.test(stage2)) win = room.peserta[1]
      else if (k.test(stage) && b.test(stage2)) win = room.peserta[0]
      else if (k.test(stage) && g.test(stage2)) win = room.peserta[1]
      else if (stage == stage2) tie = true
      server.client.sendMessage(room.asal, `
_*Hasil Suit*_${tie ? '\nSERI' : ''}

@${room.peserta[0].split`@`[0]} (${room.text}) ${tie ? '' : room.peserta[0] == win ? ` Menang \n+${room.poin}XP\nBonus +${room.poin_bot}` : ` Kalah \n-${room.poin_lose}XP`}
@${room.peserta[1].split`@`[0]} (${room.text2}) ${tie ? '' : room.peserta[1] == win ? ` Menang \n+${room.poin}XP\nBonus +${room.poin_bot}` : ` Kalah \n-${room.poin_lose}XP`}
`.trim(),{mentions:[{id:{_serialized:room.peserta[0]}},{id:{_serialized:room.peserta[1]}}]})
      if (!tie) {
        // db.data.users[win == room.peserta[0] ? room.peserta[0] : room.peserta[1]].exp += room.poin
        // db.data.users[win == room.peserta[0] ? room.peserta[0] : room.peserta[1]].exp += room.poin_bot
        // db.data.users[win == room.peserta[0] ? room.peserta[1] : room.peserta[0]].exp += room.poin_lose

      }
      delete server.room.big[room.id]
    }
  }
  return !0
}
handler.exp = 0
//handler.tags = ['game']
//handler.child = 'suit'
handler.tags = ['game']
module.exports = handler

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
