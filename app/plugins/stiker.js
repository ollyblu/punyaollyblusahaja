const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const fetch = require('node-fetch')
const MessageMedia = require('../apiwhatsapp/src/structures')
handler = {}
handler.main = async function(dt,pesan){

    if(pesan.hasMedia){
        pesan.downloadMedia().then(async(media) => {
            //media.toFilePath(__dirname+`/oke.jpg`)
            let pos = pesan.body.indexOf('|')
                    let text = pesan.body.slice(pos>6?pos:0)
                    if(pos>6){
                    await saveFile(media,'./temp2.jpg')
                    await addTexttoImage('./temp2.jpg',text,'./app/library/impact.ttf')
                    mediabaru = await server.MessageMedia.fromFilePath('./temp2.jpg')
                    }else{mediabaru = media}
                    //media.toFilePath(__dirname+`/oke.jpg`)
                    let options = {
                        sendMediaAsSticker : true,
                        stickerAuthor: bot.creator,
                        stickerName: bot.name,
                        stickerCategories: ['👍🏻']
                       }
                    if(!mediabaru)return 0
                    await server.client.sendMessage(pesan.from,mediabaru,options)
                    //server.client.sendMessage()
                    delete mediabaru
        }).catch((reason)=>{throw reason})
    }else if(pesan.hasQuotedMsg){
        pesan.getQuotedMessage().then((qouted)=>{
            if(qouted.hasMedia){
                qouted.downloadMedia().then(async (media) =>{
                    try{
                    //const out = require('fs').WriteStream('./tmp.jpg')
                    let pos = pesan.body.indexOf('|')+1
                    let text = pesan.body.slice(pos>6?pos:0)
                    let fname = Date.now()
                    if(pos>6){
                    await saveFile(media,`./app/temp/${fname}.jpg`)
                    await addTexttoImage(`./app/temp/${fname}.jpg`,text,'./app/library/impact.ttf')
                    mediabaru = await server.MessageMedia.fromFilePath(`./app/temp/${fname}.jpg`)
                    }else{mediabaru = media}
                    //media.toFilePath(__dirname+`/oke.jpg`)
                    let options = {
                        sendMediaAsSticker : true,
                        stickerAuthor: bot.creator,
                        stickerName: bot.name,
                        stickerCategories: ['👍🏻']
                       }
                    if(!mediabaru)return 0
                    await server.client.sendMessage(pesan.from,mediabaru,options)
                    //server.client.sendMessage()
                    delete mediabaru
                    }catch (e){
                        throw e
                    }
                }).catch((reason)=>{throw reason})
             }
        }).catch((reason)=>{throw reason})
        
    }else {
        pesan.reply(`Silahkan kirim gambar dengan caption *!stiker* atau reply gambar dengan perintah *!stiker*`)
    }
    
}
handler.help = 'stiker|text'
handler.tags = ['stiker','top']
handler.command = /stiker/
async function saveFile(media,filepath){
    fs.writeFileSync(filepath,media.data,{encoding: 'base64'})
}
async function addTexttoImage(imagePath, teks, fontPath) {
    try {
        // Memuat gambar menggunakan modul canvas
        const image = await loadImage(imagePath);

        // Mendapatkan lebar dan tinggi gambar
        const width = image.width;
        const height = image.height;

        // Membuat canvas baru dengan ukuran yang sama dengan gambar
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Menggambar gambar pada canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Mengatur font yang akan digunakan
        registerFont(fontPath, { family: 'Impact' });
        ctx.font = `${Math.floor(width*height*0.0002)}px Impact`; // Ukuran font

        // Mengatur gaya teks (misalnya, warna dan posisi teks)
        ctx.fillStyle = 'white'; // Warna teks
        ctx.textAlign = 'center'; // Teks berada di tengah horisontal gambar
        ctx.textBaseline = 'top'; // Teks berada di tengah vertikal gambar
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 20

        // Menentukan posisi teks
        const x = width / 2;
        const y = height / 2;

        // Menambahkan teks pada gambar
        ctx.fillText(teks, x, y);

        // Simpan gambar dengan teks ke dalam file baru
        const stream = canvas.createJPEGStream();
        const out = require('fs').createWriteStream(imagePath);
        stream.pipe(out);

        // Mengembalikan Promise yang akan menunggu penyimpanan selesai
        return new Promise((resolve, reject) => {
            out.on('finish', () => {
                console.log('Gambar dengan teks berhasil disimpan.');
                resolve();
            });

            out.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        throw error;
    }
}
module.exports = handler