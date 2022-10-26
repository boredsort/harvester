
const puppeteer = require('puppeteer');
const { appendFile  } = require('fs/promises');
const fs = require('fs');
const harvester = require('./harvester');


async function start(argv) {
    const headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
        "upgrade-insecure-requests": "1",
        "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,en;q=0.8",
    }
    const headless = true

    let searchKey = argv.keyword
    let pages = argv.page 
    
    const app = await harvester.Harvester({headers, headless})
    await app.connect();
    await app.sleep(3000);
    await app.search(searchKey);
    await app.sleep(3000);
    await app.prev();
    let result = {}


    for(let i = 1; i <= pages; i++) {
        result[`page-${i}`] = await app.harvest()
        await app.next()
    }
    let today = new Date()
    result_obj = {
      "meta": {
        "searchKey": searchKey,
        "date": today.toISOString()
      },
      "results": result
    }

    console.log('Writing search results...')
    let tmp_name = searchKey.replaceAll(/\s/g, "-")
    let timestamp = today.valueOf()

    let resultDir = 'result'

    try{
      if (!fs.existsSync(resultDir)){
        fs.mkdirSync(resultDir);
      }
  
      await appendFile(`${resultDir}/${tmp_name}-${timestamp}.json`, JSON.stringify(result_obj, null, 4))
    }
    catch(e){
      console.log('Unable to write result, something occured')
    }


    process.exit(1)
}

require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('search [keyword]', 'provide search key to be used',
      (args) => {
        args.positional('page', {
          type: 'number',
          default: 1,
          describe: 'Set the number of pages to be return'
        })
        args.positional('keyword',{
          type: 'string',
          default: '',
          describe: 'Set the keyword to find'
        })
        return args
      },
      (argv) => {
        start(argv);
      }
    )
    .demandCommand().argv;
