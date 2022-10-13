const puppeteer = require('puppeteer');

module.exports.Harvester = async (options) => {

    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
    let URL = 'https://www.google.com';
    if (options.headers){
        page.setExtraHTTPHeaders(options.headers)
    }

    const sleep = async (milliseconds) => {
        return new Promise( resolve => setTimeout(resolve, milliseconds))
    }
    // should be a search function. goto should be abstracted
    const connectHandler = async (options) => {

        try {

            let response = await page.goto(URL, options)
            if (response.status() == 200 || response.status() == 201) {
                return response
            }
            throw Error(`Failed to connect to the URL, status ${response.status()}`)
        }
        catch (error) {
            throw error
        }
    }

    const searchHandler = async (search_string) => {

        /** ------- Enter a search key word and process -------- */
        try {
            await page.waitForSelector('input.gLFyf.gsfi');
            await page.hover('input.gLFyf.gsfi');
            await page.evaluate( () => { document.querySelector('input.gLFyf.gsfi').value="" })
            await sleep(500)
            await page.type('input.gLFyf.gsfi', search_string);
            console.log(`Searching for ${search_string}`)
            await page.keyboard.press('Enter')
        }
        catch (error) {
            throw error
        }
        
    }

    const harvestHandler = async (pages=1) => {
        
        let result_urls = [];
        
        /** ------- Find and get the URL links ---------------- */
        try {
            await page.waitForSelector('div.g')
            await page.waitForTimeout(1000)
            console.log('Extract search results...')
            result_urls = await page.evaluate( () => {
                try {
                    let urls = []
                    let results = document.querySelectorAll("div.g");
                    for(res of results){
                        let a_tag = res.querySelector('div.yuRUbf > a')

                        if (a_tag) {
                            urls.push(a_tag.href)
                        } 
                    }
                    return urls 
                }
                // this catch error does only on the browser instance
                // should just return nothing on error.
                catch {
                    return
                }
            })
        }
        catch (error) {
            throw error
        }
        return result_urls
    }

    const nextHandler = async () => {
        try {
            let next_tag = await page.waitForSelector("a#pnnext")
            await next_tag.click()
            return true
        }
        catch (error) {
            return false
        }
    }

    const prevHandler = async () => {
        try {
            let next_tag = await page.waitForSelector("a#pnprev")
            await next_tag.click()
            return true
        }
        catch (error) {
            return false
        }
    }

    return {
        search: searchHandler,
        harvest: harvestHandler,
        connect: connectHandler,
        next: nextHandler,
        prev: prevHandler,
        sleep
    }
}