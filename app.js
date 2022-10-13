const { appendFile } = require('fs/promises');

const harvester = require('./harvester');


async function start() {
    const headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
        "upgrade-insecure-requests": "1",
        "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,en;q=0.8",
    }
    const headless = false
    const valid = [ '-k', '-p', '--keyword', '--pages']

    let commands = []
    let userArgs = []
    let userInput = process.argv.slice(2)
    
    if (userInput.length > 0) {
    
        while(userInput.length){
            userArgs.push(userInput.pop())
            commands.push(userInput.pop())
            
        }
    }
    
    let searchKey = ''
    let pages = 1

    for( const command of commands) {
        let i = valid.indexOf(command)

        if( i > -1){
    
            if (valid[i] == '-k' || valid[i] == '--keyword'){
                idx = commands.indexOf(command)
                searchKey = userArgs[idx]
            }
            if (valid[i] == '-p' || valid[i] == '--pages') {
                idx = commands.indexOf(command)
                searchKey = userArgs[idx]
            }
    
        }
    }
    
    const app = await harvester.Harvester({headers, headless})
    await app.connect();
    await app.sleep(3000);
    await app.search(searchKey);
    await app.sleep(3000);
    await app.prev();
    let result = {}


    for(let i = 1; i <= 3; i++) {
        result[`page-${i}`] = await app.harvest()
        await app.next()
    }

    console.log('Writing search results...')
    for( let i = 1; i <= Object.keys(result).length; i++ ) {
        await appendFile('results.json', JSON.stringify(result, null, 4))

    }   
    process.exit(1)
}

start();
