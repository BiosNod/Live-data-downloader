const fs = require("fs");
const util = require("util");
const stream = require("stream");
const https = require('https');
const http = require('http');
const { finished } = require('node:stream/promises');

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

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function forceDownload(link, fileFullPath) {
    // if you want to download only with some ext
    // if (link.indexOf('.zip') > -1) return

    // Remove all control characters in Unicode
    fileFullPath = fileFullPath.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    // Check zero files
    if (isDelZeroFiles) checkAndDelZeroFile(fileFullPath)

    const fileFolder = fileFullPath.split('/').slice(0, -1).join('/')

    console.log('fileFullPath', fileFullPath)
    if (!fs.existsSync(fileFullPath)) {
        console.log(`creating dir:`, fileFolder)
        fs.mkdirSync(fileFolder, {recursive: true})
        try {
            const tmpExt = '.~tmp'
            const fileFullTempPath = fileFullPath + tmpExt

            console.log(`Creating temp file`, fileFullTempPath)
            // Maybe previous download process crashed
            unlinkIfExists(fileFullTempPath)

            const fileStream = fs.createWriteStream(fileFullTempPath)
            const loader = link.indexOf('https') === 0 ? https : http
            let downloaded = false;

            fileStream.on("end", () => {
                downloaded = true;
            });

            console.log(`downloading ${link}`);

            await (new Promise ((resolve, reject) => {
                const request = loader.get(link);

                request.on('response', (response) => {
                    response.pipe(fileStream)
                    resolve(response);
                });

                request.on( 'error', (err) => {
                    console.error('An error occurred');
                    resolve(err);
                })
            }))

            // Waiting responce pipe
            // await finished(fileStream);
            while (!downloaded)
                await timeout(10000);

            console.log(`downloaded, removing ${tmpExt} ext`)
            // Rename tmp file name to the original name
            fs.renameSync(fileFullTempPath, fileFullPath)

            // Unlink tmp file if some error occurs while downloading
            unlinkIfExists(fileFullTempPath)
        } catch (e) {
            console.log('error:', e)
        }
    } else
        console.log(`skip, already exists ${fileFullPath}`)
}

function trimAny(str, chars) {
    let start = 0, end = str.length;

    while(start < end && chars.indexOf(str[start]) >= 0)
        ++start;

    while(end > start && chars.indexOf(str[end - 1]) >= 0)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function getFileName(path)
{
    return trimAny(path, ' /\\').split('\\').pop().split('/').pop()
}

function getFileExt(path)
{
    const match = path.match(/\.([^\./\?]+)($|\?)/);
    return match ? match[1] : null
}

module.exports = {forceDownload, getMd5Data, trimAny, getFileName, getFileExt}