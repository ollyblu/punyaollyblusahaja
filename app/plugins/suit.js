/* 
    Made by https://github.com/syahrularranger 
    Jangan di hapus credit nya :)
*/
let timeout = 60000
let poin = 500
let poin_lose = -100
let poin_bot = 200
handler = {}
handler.main = async (dt,pesan) => {
  server.room.big = server.room.big || {}//
  if(!pesan.author)return pesan.reply('Suit hanya bisa dilakukan di group')
  if (Object.values(server.room.big).find(room => room.id.startsWith('suit') && room.peserta.includes(dt.sender)))return pesan.reply('Selesaikan suit mu yang sebelumnya')
  if(Object.values(server.room.big).find(room => room.peserta.includes(dt.sender)))return pesan.reply('Kamukan sedang sibuk\nTidak bisa main main :]')
  if (!pesan.hasQoutedMsg && !pesan.mentionedIds.length){let contact ={id:{_serialized:`${bot.number}@c.us`}}; return await server.client.sendMessage(pesan.from,`_Siapa yang ingin kamu tantang?_\nTag orangnya.. Contoh\n\n !suit @${bot.number} `,{mentions: [contact]})}
  let lawan = pesan.mentionedIds[0]?pesan.mentionedIds[0]:pesan._data.quotedMsg.author
  let aku = dt.room_id
  if(lawan.split('@')[0] == bot.number){pesan.reply('Tidak bisa menantang bot 😏😋');return 0}
  //console.log(`${dt.sender} vs ${lawan}`)
  if (Object.values(server.room.big).find(room => room.id.startsWith('suit') && room.peserta.includes(lawan)))return pesan.reply(`Orang yang kamu tantang sedang bermain suit dengan orang lain :(`)
  if(Object.values(server.room.big).find(room => room.peserta.includes(lawan)))return pesan.reply('Orang yang kamu tantang sedang sibuk :[')
  let id = 'suit_' + new Date() * 1
  let caption = `
_*SUIT PvP*_

@${dt.sender.split`@`[0]} menantang @${lawan.split`@`[0]} untuk bermain suit

Silahkan @${lawan.split`@`[0]} 
`.trim()
  let footer = `\nKetik "terima/ok/gas" untuk memulai suit\nKetik "tolak/gabisa/nanti" untuk menolak`
  let C1 ={id:{_serialized:dt.sender}}
  let C2 ={id:{_serialized:lawan}}
  server.room.big[id] = {
    chat: await server.client.sendMessage(pesan.from,`${caption} ${footer}`,{mentions:[C1,C2]}),
    id: id,
    peserta : [dt.sender,lawan],
    status: 'wait',
    waktu: setTimeout(() => {
      if (server.room.big[id]) return pesan.reply(`_Waktu suit habis_`)
      //delete server.room.big[id].peserta
      delete server.room.big[id]
      delete server.room[aku].child
    }, timeout), poin, poin_lose, poin_bot, timeout
  }
}
handler.tags = ['game']
handler.help = 'suit @tag'
handler.command = /^suit(pvp)?$/i

handler.group = true
handler.game = true

module.exports = handler