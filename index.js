const Cfonts = require('cfonts')
let package = require('./package.json')
let cluster = require('cluster')
let fs = require('fs')
const path = require('path')
const yargs = require('yargs/yargs')
const Readline = require('readline')
const chalk = require('chalk')
const rl = Readline.createInterface(process.stdin,process.stdout)
global.terminal = {}
Cfonts.say('Starting...',{
  colors: ['#ff0000'],
  font:'console',
  align:'left'
})
Cfonts.say(package.name,{
    colors: ['#f2aa4c'],
    font: 'block',
    align: 'center',
})
Cfonts.say(`${package.author} dan ${package.name} dan ${package.main}`,{
    colors:['#f2aa4c'],
    font:'console',
    align:'center',
})
var isRunning = false
//require('./app/main.js')
function start(file){
    if(isRunning)return
    isRunning = true
    let args =  [path.join(__dirname,file),...process.argv.slice(2)]
    Cfonts.say([process.argv[0], ...args].join(' '), {
        font: 'console',
        align: 'center',
        gradient: ['red', 'magenta']
      })
    cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
    })
    let p = cluster.fork()
    p.on('message', data => {
        console.log('[RECEIVED]', data)
        terminal.message = data
        switch (data) {
          case 'reset':
            p.kill()
            isRunning = false
            start.apply(this, arguments)
            break
          case 'uptime':
            p.send(process.uptime())
            break
          case 'break':
            terminal.break = true
            console.log('short break')
            break

        }
    })
    p.on('exit', code => {
        isRunning = false
        console.error(chalk.redBright('Exited with code:', code))
        if (code === 0) return
        process.exit()
        fs.watchFile(args[0], () => {
          fs.unwatchFile(args[0])
          start(file)
        })
      })
    p.on('error',err =>{
      console.error(chalk.redBright(err))
    })
      let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
      if (!opts['test'])
        if (!rl.listenerCount()) rl.on('line', line => {
          p.emit('message', line.trim())
        })
}
start('./app/main.js')