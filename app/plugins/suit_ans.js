handler = {}
handler.all = async function (pesan) {
  //this.suit = this.suit ? this.suit : {}
  //if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0
  server.room.suit = server.room.suit || {}
  let room = Object.values(server.room.suit).find(room => room.id && room.status && [room.p, room.p2].includes(server.sender))
  if (room) {
    let win = ''
    let tie = false
    if (server.sender == room.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body) && pesan.author && room.status == 'wait') {
      if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body)) {
        server.client.sendMessage(pesan.from,`@${room.p2.split`@`[0]} menolak suit, suit dibatalkan`,{mention:[{id:{_serialized:room.p2}}]})
        delete server.room.suit[room.id]
        return !0
      }
      room.status = 'play'
      room.asal = pesan.from
      clearTimeout(room.waktu)
      //delete room[room.id].waktu
      server.client.sendMessage(pesan.from,`Suit telah dikirimkan ke chat
@${room.p.split`@`[0]} dan 
@${room.p2.split`@`[0]}

Silahkan pilih suit di chat masing"
klik wa.me/${bot.number}`,{mentions:[{id:{_serialized:room.p}},{id:{_serialized:room.p2}}]})

      if (!room.pilih) server.client.sendMessage(room.p, `Silahkan ketik\n *Batu* / *Kertas* / *Gunting* \nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\nBonus +${room.poin_bot}`)
      if (!room.pilih2) server.client.sendMessage(room.p2, `Silahkan ketik\n *Batu* / *Kertas* / *Gunting* \nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\nBonus +${room.poin_bot}`)
      room.waktu_milih = setTimeout(() => {
        if (!room.pilih && !room.pilih2) server.client.sendMessage(pesan.from, `Kedua pemain tidak niat main,\nSuit dibatalkan`)
        else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.p2 : room.p
          server.client.sendMessage(pesan.from, `@${(room.pilih ? room.p2 : room.p).split`@`[0]} tidak memilih suit, game berakhir`.trim(),{mentions:[{id:{_serialized:room.pilih ? room.p2 : room.p}}]})
          //db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
          //db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot
          //db.data.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose
        }
        delete server.room.suit[room.id]
        return !0
      }, room.timeout)
    }
    let jwb = pesan.from == room.p
    let jwb2 = pesan.from == room.p2
    let g = /gunting/i
    let b = /batu/i
    let k = /kertas/i
    let reg = /^(gunting|batu|kertas)/i
    if (jwb && reg.test(pesan.body) && !room.pilih && !pesan.author) {
      room.pilih = reg.exec(pesan.body.toLowerCase())[0]
      room.text = pesan.body
      pesan.reply(`Kamu telah memilih ${pesan.body} ${!room.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih2) server.client.sendMessage(room.p2, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    if (jwb2 && reg.test(pesan.body) && !room.pilih2 && !pesan.author) {
      room.pilih2 = reg.exec(pesan.body.toLowerCase())[0]
      room.text2 = pesan.body
      pesan.reply(`Kamu telah memilih ${pesan.body} ${!room.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih) server.client.sendMessage(room.p, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    let stage = room.pilih
    let stage2 = room.pilih2
    if (room.pilih && room.pilih2) {
      clearTimeout(room.waktu_milih)
      if (b.test(stage) && g.test(stage2)) win = room.p
      else if (b.test(stage) && k.test(stage2)) win = room.p2
      else if (g.test(stage) && k.test(stage2)) win = room.p
      else if (g.test(stage) && b.test(stage2)) win = room.p2
      else if (k.test(stage) && b.test(stage2)) win = room.p
      else if (k.test(stage) && g.test(stage2)) win = room.p2
      else if (stage == stage2) tie = true
      server.client.sendMessage(room.asal, `
_*Hasil Suit*_${tie ? '\nSERI' : ''}

@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? ` Menang \n+${room.poin}XP\nBonus +${room.poin_bot}` : ` Kalah \n-${room.poin_lose}XP`}
@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? ` Menang \n+${room.poin}XP\nBonus +${room.poin_bot}` : ` Kalah \n-${room.poin_lose}XP`}
`.trim(),{mentions:[{id:{_serialized:room.p}},{id:{_serialized:room.p2}}]})
      if (!tie) {
        // db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
        // db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot
        // db.data.users[win == room.p ? room.p2 : room.p].exp += room.poin_lose

      }
      delete server.room.suit[room.id]
    }
  }
  return !0
}
handler.exp = 0
//handler.room = 'game'
module.exports = handler

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
