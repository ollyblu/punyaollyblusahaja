handler = {}
handler.main = async function(dt,pesan){
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');
    
    const shortLink = 'https://tinyurl.com/2mwqgz22'; // Ganti dengan short link TinyURL yang sesuai
    
    function getOriginalImageUrl(shortLink) {
      return fetch(shortLink)
        .then(response => response.text())
        .then(html => {
          const $ = cheerio.load(html);
          const redirectUrl = $('body').find('a').attr('href');
    
          if (redirectUrl) {
            return fetch(redirectUrl);
          } else {
            throw new Error('Tidak dapat menemukan URL gambar asli.');
          }
        })
        .then(response => response.url)
        .catch(error => {
          console.error('Terjadi kesalahan:', error);
        });
    }
    
    getOriginalImageUrl(shortLink)
      .then(originalImageUrl => {
        console.log(originalImageUrl)
        if(!originalImageUrl)return 0
        if (originalImageUrl.endsWith('.png')) {
          console.log('Link gambar asli:', originalImageUrl);
          // Lakukan sesuatu dengan URL gambar asli di sini
        } else {
          console.log('Link yang diarahkan bukan gambar .png.');
        }
      });
    
}
handler.command = /test/
module.exports = handler
