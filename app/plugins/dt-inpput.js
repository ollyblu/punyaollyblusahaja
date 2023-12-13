handler ={}
'.gender|laki'
handler.main = async function(dt,pesan){
    if(dt.args.length<2)return pesan.reply(`Gender Kamu: ${db.users.data[dt.sender].gender}\nUntuk mengganti gender ketik\n!gender (gender kamu)`)
    let sender = dt.sender    
    if(pesan.mentionedIds.length)sender = pesan.mentionedIds
    let gender = dt.args[1]
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
    if(/perempuan|P|wedok|cewe/i.test(gender))gender = 'P'
    else if(/laki|pria|L|cowo|lanang/i.test(gender))gender = 'L'
    else return pesan.reply('Nulis gender yang bener dong\n(P / L)')
    db.users.data[sen].gender = gender
    pesan.react('👍🏻')
    //pesan.reply(`Your gender: ${db.users.data[sender].gender}`)
}
    //pesan.reply(`Your gender: ${db.users.data[sender].gender}`)
    switch(db.users.data[sender].gender){
        case 'L':
            pesan.react('🧑🏼') 
            break
        case 'P':
            pesan.react('👩🏼')
            break
    }
}
handler.command = /gender|gnd/
handler.help = 'gender'
handler.tags  = ['data']
module.exports = handler