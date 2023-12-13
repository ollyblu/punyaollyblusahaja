const similarity = require('similarity')
handler ={}
handler.all = async function(dt,pesan){
    server.room.big = server.room.big || {}
    let room = Object.values(server.room.big).find(room => room.id && room.id.startsWith('voting') && room.status && room.peserta.find((part)=>part.id._serialized == dt.sender))
    if (room) {
        //console.log(room)
        if (1 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body) && pesan.author && room.status == 'wait') {
          if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(pesan.body)) {
            await server.client.sendMessage(pesan.from,`@${dt.sender.split`@`[0]} menolak voting, voting dibatalkan`,{mentions:[{id:{_serialized:dt.sender}}]})
            delete server.room.big[room.id]
            return !0
          }
          room.status = 'play'
          console.log('isss plasssa')
          room.asal = pesan.from
          clearTimeout(room.waktu)
          //delete room[room.id].waktu
          await server.client.sendMessage(pesan.from,`voting telah dikirmkan ke masing masing anggota
    Silahkan pilih di chat masing"
    klik wa.me/${bot.number}`)
          let caption = 
          `‼️ ANONVOT ‼️
          Mekanisme: Admin akan membuat voting dengan minimal 2 pilihan dan waktu minimal 1 menit.
          Bot akan mengkonfirmasi dan akan menjapri semua anggota grup satu per satu.
          Teks voting berisi mekanisme, kode voting, dan pilihan voting.
          Peserta voting mempunyai 1 kali kesempatan untuk memvoting dan 1 kode untuk mencocokkan hasil.
          Setelah waktu habis atau semua peserta telah menyelesaikan voting maka bot akan menampilkan hasil voting gi grup serta kode kode peserta yang melakukan voting.
          Dengan begini maka peserta akan mencocokkan hasil votingan dan suaranya secara lebih detail
          
          ‼️ KODE ROOM ‼️
          ‼️ ${room.id} ‼️
          
          ‼️ KODE VOTING ‼️
          ‼️ %kode% ‼️
             
          ‼️ PILIHAN ‼️
          \t~${room.pilihan.join('\n\t~')}
          
          ‼️ TIMEOUT ‼️
          ‼️ ${room.timeout/60} Menit ‼️`
          function generateCode(){
            const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let code=''
            for(let i = 0;i<5;i++){
                let randomI = Math.floor(Math.random()*character.length)
                code+= character.charAt(randomI)
            }
            return code
          }
          for(peserta of room.peserta){
            if(!peserta.pilih){
                let kode = generateCode()
                peserta.kode = kode
                console.log(peserta)
                if(!peserta)continue
                server.client.sendMessage(peserta.id._serialized,caption.replace('%kode%',kode)) 
                await delay(Math.floor(Math.random()*500)+300)
            }
          }
          room.waktu_milih = setTimeout(() => {
            let sudahdipilih = 0
            for(peserta of room.peserta){
                if(peserta.pilih)sudahdipilih+=1
            }
            server.client.sendMessage(room.asal,hasilVot(room))
            delete server.room.big[room.id]
            return !0
          }, room.timeout*1000)
        }
        let sudahdipilih = 0
        for(peserta of room.peserta){
            if(peserta.pilih)sudahdipilih+=1
        }
        let penjawab = room.peserta.findIndex((peserta)=>peserta.id._serialized == dt.sender)
        if(penjawab>=0){
            if(!room.peserta[penjawab].pilih && !pesan.author){
                let pilih = room.pilihan.findIndex((pilihan)=>similarity(pilihan,pesan.body)>0.8)
                if(pilih>=0){
                    room.peserta[penjawab].pilih = room.pilihan[pilih]
                    pesan.reply(`Kamu telah memilih ${room.peserta[penjawab].pilih}`)
                }
            }
        }

        if (sudahdipilih == room.peserta.length) {
            server.client.sendMessage(room.asal,hasilVot(room))
          clearTimeout(room.waktu_milih)
          delete server.room.big[room.id]
        }
      }
      return !0
}
function hasilVot(room){
    caption = `‼️ HASIL ANONVOT ‼️

    ‼️ KODE ROOM ‼️
    ‼️ ${room.id} ‼️
    
    ‼️ PILIHAN ‼️
    \t~${room.pilihan.join('\n\t~')}
    
    ‼️ TIMEOUT ‼️
    ‼️ ${room.timeout/60} Menit ‼️
    
    ‼️‼️ HASIL DARI ${room.pilihan.length} PILIHAN ‼️‼️\n`
    let hasil = [0,0]
    let rincian = ``
    for(pilihan of room.pilihan){
        rincian += `\n‼️‼️ ${pilihan} ‼️‼️\n`
        for(peserta of room.peserta){
            if(peserta.pilih == pilihan){
                if(typeof hasil[pilihan] !== 'number')hasil[pilihan]= 0
                hasil[pilihan]+=1
                rincian += `\n${peserta.kode}`
            }
        }
    }
    let golput = 0
    rincian += `\n‼️‼️ GOLPUT ‼️‼️\n`
    for(peserta of room.peserta){
        if(!peserta.pilih){
            rincian += `\n${peserta.kode}`
            golput+=1
        }
    }
    //golput = room.peserta.length - golput
    let hasilpilihan = ``
    for(pilihan of room.pilihan){
        hasilpilihan += `\n‼️ ${pilihan} = *${hasil[pilihan]|'0'}* ‼️`
    }
    hasilpilihan += `\n‼️GOLPUT = *${golput}* ‼️`
    hasilpilihan += `\n‼️TOTAL = *${room.peserta.length}* ‼️\n`
    return caption + hasilpilihan + rincian
}
handler.tags = ['tools']
module.exports = handler

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))