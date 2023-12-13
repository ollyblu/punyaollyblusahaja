handler ={}
'.klmp|laki'
handler.main = async function(dt,pesan){
    if(dt.args.length<2)return pesan.reply(`Kelompok Kamu: ${db.users.data[dt.sender].klmp}\nUntuk mengganti Kelompok ketik\n!klmp (Kelompok kamu)`)
    let sender = [dt.sender]
    if(pesan.mentionedIds.length)sender = pesan.mentionedIds
    let klmp = dt.args[1]
    for(sen of sender){
    let user = global.db.users.data[sen]
    if (typeof user !== 'object') global.db.users.data[sen] = {}
    if (user) {
        if (!isNumber(user.level)) user.level = 1
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.limit)) user.limit = 70
        if (!isNumber(user.poinG)) user.poinG = 0
        if (!isNumber(user.money)) user.money = 0
        if (!('banned' in user)) user.banned = false
        if (!('premium' in user)) user.premium = false
        if (!isNumber(user.premiumTime)) user.premiumTime = 0
    } else {
        global.db.users.data[sen] = {
            level: 1,
            exp: 0,
            limit: 70,
            poinG: 0,
            money: 0,
            banned: false,
            premium: false,
            premiumTime: 0
        }
    }
    klmp = Number(klmp)
    if(klmp > 0)
    db.users.data[sen].klmp = klmp
    else return pesan.reply('Nulis klmp yang bener dong\n(1 s.d ...)')
}
    pesan.react('👍🏻')
    //pesan.reply(`Your klmp: ${db.users.data[sender].klmp}`)
}
handler.command = /klmp/
handler.help = 'klmp'
handler.tags  = ['data']
module.exports = handler