const fs = require('fs')
const helpers = require("./helpers");

const urlSeparator = '.com/'
const linksFolder = `${__dirname}/links`
const subFolder = 'downloads'

;(async () => {
    for (const linksFile of fs.readdirSync(linksFolder)) {
        console.log(`Reading links file: ${linksFile}`)

        const links = fs.readFileSync(`${linksFolder}/${linksFile}`).toString().split("\n")

        for (let link of links) {
            link = helpers.removeControlChars(link)
            if (!link) continue

            if (link.indexOf(urlSeparator) === -1) {
                console.warn(`Separator ${urlSeparator} not found in ${link}, skip it`)
                continue
            }

            const filePath = link.split(urlSeparator)[1]
            const fileName = helpers.getFileName(filePath);
            const fileExt = helpers.getFileExt(fileName)
            // if (!fileExt) console.warn(`File extension not found in ${link}`)
            const lastChar = link.substr(link.length - 1);

            if (lastChar === '/')
                console.warn(`Folder instead of file found in ${link}, skip it`)
            else {
                const fileFullPath = `${__dirname.replaceAll('\\', '/')}/${subFolder}/${filePath}`
                await helpers.forceDownload(link, fileFullPath)
            }
        }
    }
})()