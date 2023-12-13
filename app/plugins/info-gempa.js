let fetch = require('node-fetch')
const scrapy = require('node-scrapy')
handler = {}
handler.main = async function(dt,pesan){
    const model = ['tr:nth-child(1) td']
			fetch('https://www.bmkg.go.id/gempabumi/gempabumi-terkini.bmkg').then((res) => res.text()).then((body) => {
				let result = scrapy.extract(body, model)
                //console.log(result)
				let waktu = result[1] || "Tidak ada data"
				let lintang = result[2] || "Tidak ada data"
				let bujur = result[3] || "Tidak ada data";
				let magnitudo = result[4] || "Tidak ada data"
				let kedalaman = result[5] || "Tidak ada data"
				let lokasi = result[6] || "Tidak ada data"
                function tsunamis(){
                    if(magnitudo >= 8.0){
                        return 'Peringatan Magnitudo >8.0 Lihat Informasi BMKG Lebih Lanjut'
                    } else{
                        return 'Tidak Diketahui'
                    }
                }

				const teks = `*[ INFORMASI GEMPA INDONESIA ]*\n
${clockEmot(waktu.split(' ')[1].replace(':','-').replace(':','-'))} Waktu: *${formatDate(waktu.split(' ')[0]) +' ('+ waktu.split(' ')[1]+' '+waktu.split(' ')[2]+')'}*
🧭 Bujur: *${bujur}*
🧭 Lintang: *${lintang}*
📡 Magnitudo: *${magnitudo}*
🌋 Kedalaman: *${kedalaman}*
📍 Lokasi: *${lokasi}*
🌊 Berpotensi Tsunami : *${tsunamis()}*`.trim()
                pesan.reply(teks)
                }).catch((reason)=>{console.log('an Error');throw reason})
}
function formatDate(inputDate) {
    const [day, month, year] = inputDate.split('-');
    const dayNumber = Number(day);
    const monthNumber = Number(month) - 1;
    const yearNumber = Number(year)+2000;
    const dateObj = new Date(yearNumber, monthNumber, dayNumber);
  
    if (isNaN(dateObj.getTime())) {
      return 'Tanggal tidak valid';
    }
  
    // Daftar nama-nama bulan
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    // Dapatkan nilai hari, tanggal, bulan, dan tahun dari objek Date
    const dayOfWeek = dateObj.toLocaleString('id-ID', { weekday: 'long' });
    const date = dateObj.getDate();
    const monthName = monthNames[dateObj.getMonth()];
    const yearFull = dateObj.getFullYear();
  
    // Gabungkan nilai-nilai yang diperlukan dalam satu string
    const formattedDate = `${dayOfWeek} ${date} ${monthName} ${yearFull}`;
  
    return formattedDate;
  }
handler.command = /infogempa|bmkg/
handler.help = 'infogempa'
handler.tags = ['info']
module.exports = handler