handler = {}
const fs = require('fs')
const chalk = require('chalk')
handler.main = async function(dt,pesan){
    if(!pesan.author)return pesan.reply('Fitur hanya bisa di group')
    let group = await pesan.getChat()
    if(dt.args.length<2) return pesan.reply('Silahkan input banyak anggotanya\nContoh\n!autotim|2')
    const jumlahanggota = parseInt(dt.args[1])
    if(jumlahanggota<2)return pesan.reply('Isikan jumlah anggota dengan benar\nContoh:\n!autotim|2')
    //pesan.reply(util.format(contact))
    let penglompokan = false

    let aim = false
    let aimkelompok = false
    //aim = ['6289669811294','6289620773351']
    //aim = ['6289669811294','6285803608366']
    aimkelompok = 6

    if(dt.args.length>2)penglompokan = dt.args[2]
    participants = JSON.parse(JSON.stringify(group.groupMetadata.participants))
    participants = participants.filter(item =>item.id._serialized.split('@')[0] !== bot.number.toString())
    ///delete participants[Array(participants).findIndex((nbot)=>nbot.id._serialized.slice('@')[0] === bot.number)]
    //console.log('partp',participants)
    let target = participants.length
    let namakelompok = []

    

    console.log('target',target)
    if(penglompokan){
        try{
            for(let idpart=0;idpart<target;idpart++){
                let nomor = participants[idpart].id._serialized
                let kubu = db.users.data[nomor]
                if(typeof kubu == 'object')kubu = db.users.data[nomor][penglompokan]
                else kubu = undefined
                participants[idpart].id[penglompokan] = kubu
            }
        }catch(e){
            console.error(e)
        }
    }


    // var sudahdipilih = []
    // for(let pilihan=0;pilihan<target;pilihan++){
    //     sudahdipilih[pilihan] = false
    // }
    //console.log('pilih',sudahdipilih)
    if(target%jumlahanggota > 0){
        let kelebihan = target%jumlahanggota
        pesan.reply(`Peserta tidak rata\nTerdapat 1 kelompok dengan ${kelebihan} anggota`)
    }
    let countpemilihan
    if(penglompokan){
        countpemilihan = {}
        participants.forEach(item =>{
            const type = item.id[penglompokan]
            if(countpemilihan[type]){
                countpemilihan[type]++
            }else{
                countpemilihan[type] = 1
            }
        })
        let txt = ''
        Object.keys(countpemilihan).forEach(item=>{
            txt += `\n${item} = ${countpemilihan[item]}`
        })
        pesan.reply(`Tim berdasarkan ${penglompokan}\n${txt}`)
    }

    if(aim){
    if(aimkelompok>Math.floor(target/jumlahanggota))aimkelompok = Math.floor(target/jumlahanggota/2)
    let anggotake = 0
    for(let ind of aim){
        console.log(ind)
        let index = participants.findIndex((teman)=>console.log(teman.id)|| teman.id._serialized.split('@')[0] == ind)
        if(index<0){
            console.log(chalk.redBright(index,' tidak ditemukan'))
            aim.splice(index,1)
            aim = false
        }
        else if(typeof aimkelompok == 'number'){
            namakelompok[aimkelompok] = namakelompok[aimkelompok]| []
            namakelompok[aimkelompok][anggotake] = JSON.parse(JSON.stringify(participants.splice(index,1)[0]))
            anggotake+=1
        }
    }}

    let tersisa = target
    let pemilihan
    let banding
    let pemilihan_left
    for(let kelompok=0;kelompok< Math.round(target>jumlahanggota?target/jumlahanggota:1);kelompok++){
        namakelompok[kelompok] = []
        if(aim)if(kelompok == aimkelompok)continue
        if(penglompokan){
            if(pemilihan_left<1)delete countpemilihan[pemilihan]
            pemilihan = Math.floor(Math.random()*Object.keys(countpemilihan).length)
            banding = Object.keys(countpemilihan)[pemilihan]
            pemilihan_left = Number(countpemilihan[banding])
            //console.log('tersisa',pemilihan_left, banding)
        }
        console.log('kelompok ke',kelompok, penglompokan?banding:'')
        let looper = 0
        let sample = JSON.parse(JSON.stringify(participants))
        for(let anggota=0;anggota<(tersisa>jumlahanggota?jumlahanggota:tersisa) ;anggota++){
            //if(terminal && terminal.break){terminal.break=0;break}
            looper+=1
            let nomorpeserta = tersisa>1?Math.floor(Math.random()*sample.length):0
            //peserta = JSON.parse(JSON.stringify(participants[nomorpeserta]||{}))
            let peserta = sample.splice(nomorpeserta,1)[0]
            try{
            if(penglompokan)console.log(peserta.id[penglompokan],'banding',banding, sample.length)}catch(e){continue}
            if(penglompokan &&tersisa>1 && pemilihan_left>0 && `${peserta.id[penglompokan]}` !== `${banding}`){
                console.log('key',banding,pemilihan_left,sample.length)
                //console.log('left',pemilihan_left)
                //pemilihan_left-=1
                //participants.push(peserta)
                anggota-=1
                continue
                //pemilihan_left
                //anggota-=1
                //continue
            }else if (penglompokan){
                pemilihan_left-=1
                countpemilihan[banding]-=1
                console.log(peserta.id[penglompokan],'sama',banding)
            }
            
            //console.log(peserta)
            //if(sudahdipilih[nomorpeserta]){anggota-=1;continue}
            //if(!peserta.id){anggota-=1;continue}
            // if( typeof peserta.id !== 'undefined' && (peserta.id._serialized.split('@')[0] === bot.number.toString()))
            // {delete participants[nomorpeserta];
            //     console.log('del',bot.number) ;
            //     anggota-=1;continue}
            namakelompok[kelompok][anggota] = JSON.parse(JSON.stringify(peserta))
            participants.splice(participants.findIndex((v)=>v.id._serialized==peserta.id._serialized),1)
            sample = JSON.parse(JSON.stringify(participants))
            //delete participants[nomorpeserta]
            //sudahdipilih[nomorpeserta] = true
            //pemilihan_left-=1
            //console.log(peserta)
        }
        //pemilihan_left -= jumlahanggota
        tersisa -= jumlahanggota
    }
    //console.log('kelompok',namakelompok,target)
    if(1){
        let sv = []
        let gid = group.groupMetadata.creation
        try{
            sv = JSON.parse(fs.readFileSync(`./app/saved/autotim/${gid}.json`,{encoding:'utf-8'}))
        }catch(e){
            sv = []
        }
        sv[sv.length] = {
            used: false,
            time: Date.now(),
            penglompokan,
            target,
            jumlahanggota,
            isi:namakelompok
        }
        if(sv.length>1){
            try{
                if(sv[sv.length-1].penglompokan !== sv[sv.length-2].penglompokan)throw 'penglompokan tdk sama'
                if(sv[sv.length-1].target !== sv[sv.length-2].target)throw 'target tdk sama'
                if(sv[sv.length-1].jumlahanggota !== sv[sv.length-2].jumlahanggota)throw 'jumlahanggota tdk sama'
                //if(sv[sv.length-1].time - sv[sv.length-2].time > 3000000)throw 'jangka waktu lebih dari 50menit'
                if(sv[sv.length-2].used)throw 'tim sudah dipakai'
                console.log('WARNING USING SAVED TIM')
                namakelompok = sv[sv.length-2].isi
                sv[sv.length-2].used = true
            }catch(e){
                console.log(e)
                sv[sv.length-1].used = true
            }
        }
        fs.writeFileSync(`./app/saved/autotim/${gid}.json`,JSON.stringify(sv),{encoding:'utf-8'})
    }
    let pengumuman = ''
    for(let idnmklp=0;idnmklp<namakelompok.length;idnmklp++){
        pengumuman += `Anggota kelompok ${idnmklp+1}\n`
        //console.log('Anggota kelompok',idnmklp)
        for(let idanggt=0;idanggt<namakelompok[idnmklp].length;idanggt++){
            //console.log(namakelompok[idnmklp][idanggt])
            if(!namakelompok[idnmklp][idanggt])continue
            if(!namakelompok[idnmklp][idanggt].id)continue
            pengumuman += `${idanggt+1}. @${namakelompok[idnmklp][idanggt].id._serialized.split('@')[0]} ${penglompokan?namakelompok[idnmklp][idanggt].id[penglompokan]:''}\n`
        }
        pengumuman += '\n \n'
    }
    // let text = ''
    // for(let fcon in participants){
    //     //console.log(participants[fcon])
    //     text+= `Halo @${participants[fcon].id.user}${msg}\n`
    // }
    //server.client.sendMessage(pesan.from,text,{mentions:participants})
    server.client.sendMessage(pesan.from,pengumuman,{mentions:group.groupMetadata.participants})
}
handler.command = /autotim/i
handler.help = 'autotim <anggota>'
handler.tags = ['tools','top']
module.exports = handler
