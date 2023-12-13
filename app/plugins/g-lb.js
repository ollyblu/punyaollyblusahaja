handler ={}
handler.main = async function(dt,pesan){
    if(!pesan.author)return pesan.reply('Fitur hanya bisa di group')
    let group = dt.chat
    if(dt.args.length<2) return pesan.reply('Silahkan input nilai apa yang dirank\nContoh\n .lb poinG')
    let nilai = dt.args[1]
    participants = JSON.parse(JSON.stringify(group.groupMetadata.participants))
    participants = participants.filter(item =>item.id._serialized.split('@')[0] !== bot.number.toString())
    let target = participants.length
    if(nilai){
        try{
            for(let idpart=0;idpart<target;idpart++){
                let nomor = participants[idpart].id._serialized
                let kubu = db.users.data[nomor]
                if(typeof kubu == 'object')kubu = db.users.data[nomor][nilai]
                else kubu = undefined
                participants[idpart].id[nilai] = kubu
            }
        }catch(e){
            console.error(e)
        }
    }
    let peringkat = []
    // for(let ind=0;ind<participants.length;ind++){
    //     peringkat[ind] = 0
    //     for(let ind2=0;ind2<participants.length;ind2++){
    //         if(ind == ind2)continue
    //         if(participants[ind].id[nilai] < participants[ind2].id[nilai])
    //         peringkat[ind]++ 
    //     }
    // }
    for(let ind=0;ind<participants.length;ind++){
        for(let ind2=0;ind2<participants.length-1;ind2++){
            let temp = JSON.parse(JSON.stringify(participants[ind2]))
            if(participants[ind2+1].id[nilai] > participants[ind2].id[nilai]){
                participants[ind2] = participants[ind2+1]
                participants[ind2+1] = temp
            }
        }
    }
    let caption = `Mengurutkan anggota berdasarkan ${nilai}.\n`
    for(let per=0;per<participants.length;per++){
        //let prr = peringkat.find((orang)=>orang==per)
        let urut = `${per+1}. @${participants[per].id._serialized.split('@')[0]} (${participants[per].id[nilai]})\n`
        caption+=urut
    }
    server.client.sendMessage(pesan.from,caption,{mentions:participants})
}
handler.command = /g_lb/i
handler.help = 'g_lb'
handler.tags = ['tools']
module.exports = handler