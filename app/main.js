const cfonts = require('cfonts')
const chalk = require('chalk')
const {Client,LocalAuth,MessageMedia} = require('./apiwhatsapp')
const generate = require('qrcode-terminal')
const fs = require('fs')
const yargs = require('yargs/yargs')
const _ = require('lodash')
const path = require('path')
const syntaxerror = require('syntax-error')
// const { Configuration, OpenAIApi } = require('openai')
// const configuration = new Configuration({
//     organization: "org-xlJN19DC3k3485a9pgRgmth3",
//     apiKey: process.env.OPENAI_API_KEY||'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',
// });
// global.server = {}
// server.openai = new OpenAIApi(configuration);
// (async()=>server.response = await server.openai.listEngines())()
var low 
try{
  low = require('lowdb')
}catch(e){
  low = require('./api/lowdb')
}
const {Low,JSONFile} = low
const {mongoDB, mongoDBV2} = require('./api/mongoDB')
global.bot = {}
bot = require('./settings/data.json')
require('./settings/config')
require('./extension/index')
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp ={
  start: new Date()
}
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = global.db||{}
global.db.users = new Low(
  // /https?:\/\//.test(opts['db'] || '') ?
  //   new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
  //     new mongoDB(opts['db']) :
      new JSONFile(`${__dirname}/database/${opts._[0] ? opts._[0] + '_' : ''}users.json`)
)
global.db.room = new Low(
  // /https?:\/\//.test(opts['db'] || '') ?
  //   new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
  //   new mongoDB(opts['db']) :
    new JSONFile(`${__dirname}/database/${opts._[0] ? opts._[0] + '_' : ''}rooms.json`)
)
global.DATABASE ={}
global.DATABASE.users = global.db.users
global.DATABASE.room = global.db.room
global.loadDatabase_users = async function loadDatabase_users(){
  if (global.db.users.READ) return new Promise((resolve) => setInterval(function () { (!global.db.users.READ ? (clearInterval(this), resolve(global.db.users.data == null ? global.loadDatabase_users() : global.db.users.data)) : null) }, 1 * 1000))
  if (global.db.users.data !== null) return
  global.db.users.READ = true
  await global.db.users.read()
  global.db.users.READ = false
  global.db.users.data ={
    ...(global.db.users.data||{})
  }
  global.db.users.chain = _.chain(global.db.users.data)
}
global.loadDatabase_room = async function loadDatabase_room(){
  if (global.db.room.READ) return new Promise((resolve) => setInterval(function () { (!global.db.room.READ ? (clearInterval(this), resolve(global.db.room.data == null ? global.loadDatabase_room() : global.db.room.data)) : null) }, 1 * 1000))
  if (global.db.room.data !== null) return
  global.db.room.READ = true
  await global.db.room.read()
  global.db.room.READ = false
  global.db.room.data ={
    ...(global.db.room.data||{})
  }
  global.db.room.chain = _.chain(global.db.room.data)
}
loadDatabase_users()
loadDatabase_room()
if (!opts['test']) {
  if (global.db.users) setInterval(async () => {
    if (global.db.users.data) await global.db.users.write()
    if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
  }, 35 * 1000)
  if (global.db.room) setInterval(async () => {
    if (global.db.room.data) await global.db.room.write()
    if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
  }, 30 * 1000)
}
global.dbLoad = async function dbLoad(){
  if(global.db.users.data == null)await loadDatabase_users()
  if(global.db.room.data == null)await loadDatabase_room()
}
dbLoad()
global.server = {}
server.room = {}
server.client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer:{
      headless: true,
      product: 'chrome',
      timeout:30000,
      args: ['--no-sandbox']
  }
})
server.MessageMedia = MessageMedia
const imports = (path) => {
  path = require.resolve(path)
  let modules, retry = 0
  do {
    if (path in require.cache) delete require.cache[path]
    modules = require(path)
    retry++
  } while ((!modules || (Array.isArray(modules) || modules instanceof String) ? !(modules || []).length : typeof modules == 'object' && !Buffer.isBuffer(modules) ? !(Object.keys(modules || {})).length : true) && retry <= 10)
  return modules
}
let isInit = true
global.reloadHandler = async function (restatConn) {
  
  if (restatConn) {
    try { await global.server.client.resetState() } catch { }
    // global.conn = {
    //   ...global.conn, ...simple.makeWASocket(connectionOptions)
    // }
  }
  if (!isInit) {
    server.client.off('qr',(qr)=>handler.qr(qr))
    server.client.off('auth_failure',(reason)=>handler.auth_failure(reason))
    server.client.off('authenticated',()=>handler.authenticated())
    server.client.off('ready',()=>handler.ready())
    server.client.off('loading_screen',(percent,message)=>handler.loading_screen(percent,message))
    server.client.off('message_create',(message)=>handler.message_create(message))
    server.client.off('message',(message)=>handler.message_(message))
    server.client.removeAllListeners('qr')
    server.client.removeAllListeners('auth_failure')
    server.client.removeAllListeners('authenticated')
    server.client.removeAllListeners('ready')
    server.client.removeAllListeners('loading_screen')
    server.client.removeAllListeners('message_create')
    server.client.removeAllListeners('message')
  }
  let handler = imports('./handler')

  server.welcome = 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc'
  server.bye = 'Selamat tinggal @user!'
  server.spromote = '@user sekarang admin!'
  server.sdemote = '@user sekarang bukan admin!'
  server.sDesc = 'Deskripsi telah diubah ke \n@desc'
  server.sSubject = 'Judul grup telah diubah ke \n@subject'
  server.sIcon = 'Icon grup telah diubah!'
  server.sRevoke = 'Link group telah diubah ke \n@revoke'
  server.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
  server.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
  server.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
  server.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

  server.client.on('qr',(qr)=>handler.qr(qr))
  server.client.on('auth_failure',(reason)=>handler.auth_failure(reason))
  server.client.on('authenticated',()=>handler.authenticated())
  server.client.on('ready',()=>handler.ready())
  server.client.on('disconnected',(nav)=>handler.disconnected(nav))
  server.client.on('change_state',(state)=>handler.changestate(state))
  server.client.on('loading_screen',(percent,message)=>handler.loading_screen(percent,message))
  server.client.on('message_create',(message)=>handler.message_create(message))
  server.client.on('message',(message)=>handler.message_(message))
  if(isInit)server.client.initialize()
  isInit = false
  return true
}
let pluginFolder = path.join(__dirname, 'plugins')
let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
  try {
    global.plugins[filename] = require(path.join(pluginFolder, filename))
  } catch (e) {
    console.error(e)
    delete global.plugins[filename]
  }
}
console.log(Object.keys(global.plugins))
global.reload = (_ev, filename) => {
    if (pluginFilter(filename)) {
      let dir = path.join(pluginFolder, filename)
      if (dir in require.cache) {
        delete require.cache[dir]
        if (fs.existsSync(dir)) console.info(`re require plugin '${filename}'`)
        else {
          console.warn(`deleted plugin '${filename}'`)
          return delete global.plugins[filename]
        }
      } else console.info(`requiring new plugin '${filename}'`)
      let err = syntaxerror(fs.readFileSync(dir), filename)
      if (err) console.error(`syntax error while loading '${filename}'\n${err}`)
      else try {
        global.plugins[filename] = require(dir)
      } catch (e) {
        console.error(e)
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)
global.reloadHandler()
