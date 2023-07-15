/* 
    Made by https://github.com/syahrularranger 
    Jangan di hapus credit nya :)
*/
let timeout = 60000
let poin = 500
let poin_lose = -100
let poin_bot = 200
handler = {}
handler.main = async (pesan) => {
  server.room.suit = server.room.suit || {}//
  if(!pesan.author)return pesan.reply('Suit hanya bisa dilakukan di group')
  if (Object.values(server.room.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(server.sender)))return pesan.reply('Selesaikan suit mu yang sebelumnya')
  if (!pesan.hasQoutedMsg && !pesan.mentionedIds.length){let contact ={id:{_serialized:`${bot.number}@c.us`}}; return await server.client.sendMessage(pesan.from,`_Siapa yang ingin kamu tantang?_\nTag orangnya.. Contoh\n\n !suit @${bot.number} `,{mentions: [contact]})}
  let lawan = pesan.mentionedIds[0]?pesan.mentionedIds[0]:pesan._data.quotedMsg.author
  if(lawan.split('@')[0] == bot.number){pesan.reply('Tidak bisa menantang bot 😏😋');return 0}
  //console.log(`${server.sender} vs ${lawan}`)
  if (Object.values(server.room.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(lawan))) pesan.reply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :(`)
  let id = 'suit_' + new Date() * 1
  let caption = `
_*SUIT PvP*_

@${server.sender.split`@`[0]} menantang @${lawan.split`@`[0]} untuk bermain suit

Silahkan @${lawan.split`@`[0]} 
`.trim()
  let footer = `\nKetik "terima/ok/gas" untuk memulai suit\nKetik "tolak/gabisa/nanti" untuk menolak`
  let C1 ={id:{_serialized:server.sender}}
  let C2 ={id:{_serialized:lawan}}
  server.room.suit[id] = {
    chat: await server.client.sendMessage(pesan.from,`${caption} ${footer}`,{mentions:[C1,C2]}),
    id: id,
    p: server.sender,
    p2: lawan,
    status: 'wait',
    waktu: setTimeout(() => {
      if (server.room.suit[id]) pesan.reply(`_Waktu suit habis_`)
      delete server.room.suit[id]
      delete server.room[server.room_id].child
    }, timeout), poin, poin_lose, poin_bot, timeout
  }
}
handler.room = 'game'
handler.help = 'suit @tag'
handler.command = /^suit(pvp)?$/i

handler.group = true
handler.game = true

module.exports = handler