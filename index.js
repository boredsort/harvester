const puppeteer = require('puppeteer');

const URL = 'https://www.google.com';

const HEADLESS = false;

const search_string = 'batman';

(async () => {
    try {
        const browser = await puppeteer.launch({headless: HEADLESS});
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
            "upgrade-insecure-requests": "1",
            "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,en;q=0.8",
        });
    
        const response = await page.goto(URL, {waitUntil: "networkidle0"});
    
        if(response.status() == 200) {

            let result_urls = []
    
            /** ------- Enter a search key word and process -------- */
            try {
                await page.waitForSelector('input.gLFyf.gsfi');
                await page.hover('input.gLFyf.gsfi');
                await page.type('input.gLFyf.gsfi', search_string);
                console.log(`Searching for ${search_string}`)
                await page.keyboard.press('Enter')
            }
            catch(error){
                throw error
            }
    
            /** ------- Find and get the URL links ---------------- */
            try{
                await page.waitForSelector('div.g')
                await page.waitForTimeout(1000)
                result_urls = await page.evaluate( () => {
                    try {
                        let urls = []
                        let results = document.querySelectorAll("div.g");
                        for(res of results){
                            let a_tag = res.querySelector('div.yuRUbf > a')
                            console.log(a_tag)
                            if (a_tag) {
                                urls.push(a_tag.href)
                            } 
                        }

                        return urls 
                    }
                    catch(error){
                        return
                    }
                })

                console.log(result_urls)

            }
            catch(error){
                throw error
            }
    
    
    
            await browser.close();
        } else {
            throw Error(`Unable to connect, status code ${response.status()}`);
        }
    }
    catch(error) {
        console.log(error)
    }
 
})();