
const chalk = require('chalk')
const util = require('util')
handler = {}
'.anonvot IKAN AYAM TUNA 4'
handler.main = async function(dt,pesan){
    server.room.big = server.room.big || {}//
    console.log('mulai')
    if(!pesan.author)return pesan.reply('voting hanya bisa dilakukan di group')
    if(dt.args.length<2)return pesan.reply(`‼️ ANONVOT ‼️
Mekanisme: Admin akan membuat voting dengan minimal 2 pilihan dan waktu minimal 1 menit.
Bot akan mengkonfirmasi dan akan menjapri semua anggota grup astu per satu.
Teks voting berisi mekanisme, kode voting, dan pilihan voting.
Peserta voting mempunyai 1 kali kesempatan untuk memvoting dan 1 kode untuk mencocokkan hasil.
Setelah waktu habis atau semua peserta telah menyelesaikan voting maka bot akan menampilkan hasil voting gi grup serta kode kode peserta yang melakukan voting.
Dengan begini maka peserta akan mencocokkan hasil votingan dan suaranya secara lebih detail
Contoh..
.anonvot IKAN AYAM SAYUR 5`)
    if(dt.args.length<3)return pesan.reply('Kurangnya argumen(butuh setidaknya 2)')
    let pilihan = dt.args.slice(1,dt.args.length-1)
    console.log(dt.args[dt.args.length-1])
    let timeout = Number(dt.args[dt.args.length-1])*60
    if(timeout < 60)return pesan.reply('Waktu minimal 60 detik')
    if (Object.values(server.room.big).find(room => room.id && room.id.startsWith('voting') && room.status && room.peserta.find((part)=>part.id._serialized == dt.sender)))return pesan.reply('Voting sebelumnya belum diselesaikan')
    if(Object.values(server.room.big).find(room => room.peserta.includes(dt.sender)))pesan.reply('Beberapa orang di grup ini sedang sibuk')
    let id = String('voting'+dt.room_id+'_'+Math.round(Math.random()*1000))
    let caption = `‼️ ANONVOT ‼️
Mekanisme: Admin akan membuat voting dengan minimal 2 pilihan dan waktu minimal 1 menit.
Bot akan mengkonfirmasi dan akan menjapri semua anggota grup satu per satu.
Teks voting berisi mekanisme, kode voting, dan pilihan voting.
Peserta voting mempunyai 1 kali kesempatan untuk memvoting dan 1 kode untuk mencocokkan hasil.
Setelah waktu habis atau semua peserta telah menyelesaikan voting maka bot akan menampilkan hasil voting gi grup serta kode kode peserta yang melakukan voting.
Dengan begini maka peserta akan mencocokkan hasil votingan dan suaranya secara lebih detail

‼️ KODE ROOM ‼️
‼️ ${id} ‼️
   
‼️ PILIHAN ‼️
\t~${pilihan.join('\n\t~')}

‼️ TIMEOUT ‼️
‼️ ${timeout/60} Menit ‼️

\nKetik "terima/ok/gas" untuk mengkonfirmasi voting\nKetik "tolak/gabisa/nanti" untuk menolak`
    
    let group = await pesan.getChat()
    participants = JSON.parse(JSON.stringify(group.groupMetadata.participants))
    participants = participants.filter(item =>item.id._serialized.split('@')[0] !== bot.number.toString())
    await server.client.sendMessage(pesan.from,`${caption}`,{mentions:participants})
    server.room.big[id] = {
        id: id,
        peserta : participants,
        status: 'wait',
        waktu: setTimeout(() => {
          if (server.room.big[id]) return pesan.reply(`_Waktu voting Habis_`)
          //delete server.room.big[id].peserta
          delete server.room.big[id]
          delete server.room[dt.room_id].child
        }, timeout*1000),pilihan, timeout
      }
    let inerg = util.inspect(server.room.big[id])
    pesan.reply(inerg)
}
handler.tags = ['tools','top']
handler.help = 'anonvot item1 item2 item3 timeout'
handler.command = /anonvot/i

handler.group = true

module.exports = handler