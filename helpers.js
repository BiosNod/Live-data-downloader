const fs = require("fs");
const util = require("util");
const stream = require("stream");
const https = require('https');
const http = require('http');

const unlinkIfExists = (filePath) => fs.existsSync(filePath) ? fs.unlinkSync(filePath) : ''
// Check and remove zero size files (this can slow down data processing)
const isDelZeroFiles = false

function getMd5Data(x) {
    let y = {}
    if (x.startsWith("{")) { // New style
        y = JSON.parse(x)
    } else {
        y = {
            remoteName: x.split(" ")[0],
            md5: x.split(" ")[1].split("|")[0],
            fileSize: parseInt(x.split(" ")[1].split("|")[1])
        }
        if (x.split(" ").length > 2) { // Third element is P if isPatch is true
            y.isPatch = true;
            if (x.split(" ").length > 3)
                y.localName = x.split(" ")[3]
        }
    }
    return y;
}

function checkAndDelZeroFile(filePath) {
    if (!isDelZeroFiles) return

    if (fs.existsSync(filePath) && fs.statSync(filePath).size === 0) {
        console.log(`empty ${filePath}, unlinking...`)
        fs.unlinkSync(filePath)
    }
}

async function forceDownload(link, fileFullPath) {
    // if you want to download only with some ext
    if (link.indexOf('.zip') > -1) return

    if (isDelZeroFiles) checkAndDelZeroFile(fileFullPath)

    const fileFolder = fileFullPath.split('/').slice(0, -1).join('/')

    if (!fs.existsSync(fileFullPath)) {
        fs.mkdirSync(fileFolder, {recursive: true})
        console.log(`downloading ${link}`)
        try {
            const tmpExt = '.~tmp'
            const fileFullTempPath = fileFullPath + tmpExt

            // Maybe previous download process crashed
            unlinkIfExists(fileFullTempPath)

            const fileStream = fs.createWriteStream(fileFullTempPath)
            const loader = link.indexOf('https') === 0 ? https : http

            loader.get(link, {timeout: 10000}, (response) => response.pipe(fileStream))

            // Wait until file downloaded
            await util.promisify(stream.finished)(fileStream).then(() => {
                // Rename tmp file name to original name
                fs.renameSync(fileFullTempPath, fileFullPath)
            }).finally(() => {
                // Unlink tmp file if some error occurs while downloading
                unlinkIfExists(fileFullTempPath)
            })

            console.log('downloaded and saved')
        } catch (e) {
            console.log('error:', e)
        }
    } else
        console.log(`skip, already exists ${fileFullPath}`)
}

module.exports = {forceDownload, getMd5Data}