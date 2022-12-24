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

function removeControlChars(str) {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
}

function formatFileSize(bytes,decimalPoint) {
    if(bytes === 0) return '0 Bytes';
    let k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function forceDownload(link, fileFullPath) {
    // Remove all control characters in Unicode
    link = trimAny(removeControlChars(link))
    fileFullPath = trimAny(removeControlChars(fileFullPath))

    // if (link.indexOf('oversea_beta') === -1) return
    // if you want to download only with some ext
    // if (link.indexOf('.zip') > -1) return

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
            // To disable tmp files download resuming, uncomment:
            // unlinkIfExists(fileFullTempPath)

            const isTmpExists = fs.existsSync(fileFullTempPath)
            const fileStream = fs.createWriteStream(fileFullTempPath, isTmpExists ? {flags: 'a'} : {})
            let stats = isTmpExists ? fs.statSync(fileFullTempPath) : {size: 0}

            const loader = link.indexOf('https') === 0 ? https : http
            let downloaded = false;

            fileStream.on("end", () => {
                downloaded = true;
            });

            console.log(`downloading ${link}`);

            // Variables to show downloading progress
            let received_bytes = 0, total_bytes = 0

            function makeRequest() {
                const location = new URL(link);

                // Resume bytes if tmp partially downloaded before
                const headers =
                    {
                        'Accept-Ranges': 'arraybuffer',
                        'Response-Type': 'arraybuffer',
                        'Range': `bytes=${stats.size}-`
                    }

                // console.log(headers)
                // process.exit(1)

                const options = {
                    hostname: location.hostname,
                    path: location.pathname,
                    headers: headers
                }

                return loader.get(options).on('response', (response) => {
                    total_bytes = parseInt(response.headers['content-length']);
                    console.log("Total size: ", formatFileSize(total_bytes))

                    response
                        .on('error', (err) => {
                            console.error('An error occurred', err);
                        })
                        .on('data', function (chunk) {
                            //gets percentage after every chunk
                            received_bytes += chunk.length;
                            console.log(`[${link}] progress: ${formatFileSize(received_bytes)}/${formatFileSize(total_bytes)}, ${(received_bytes * 100 / total_bytes).toFixed(2)}%`)
                            // allow external code to continue
                            if (received_bytes === total_bytes)
                                downloaded = true
                        })
                        .pipe(fileStream)
                })
            }

            let request = makeRequest()
            let last_received_bytes = 0
            let last_time_diff = Date.now()

            // Waiting for response pipe and checking network stuck
            while (!downloaded) {
                await timeout(100);

                // If after 5 sec no changes
                if (Date.now() - last_time_diff > 5000) {
                    last_time_diff = Date.now()

                    if (last_received_bytes !== received_bytes)
                        last_received_bytes = received_bytes
                    else {
                        console.warn("network stuck, trying to resume...")
                        // recalculate stats to know last byte number to resume
                        stats = fs.statSync(fileFullTempPath)
                        received_bytes = total_bytes = 0
                        // restart + resume
                        request = makeRequest()
                    }
                }
            }

            console.log(`downloaded, removing ${tmpExt} ext`)
            // Rename tmp file name to the original name
            fs.renameSync(fileFullTempPath, fileFullPath)
            // For debug
            // process.exit(1);

            // Unlink tmp file if some error occurs while downloading
            unlinkIfExists(fileFullTempPath)
        } catch (e) {
            console.log('error:', e)
        }
    } else
        console.log(`skip, already exists ${fileFullPath}`)
}

function trimAny(str, chars = ' ') {
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

module.exports = {forceDownload, getMd5Data, trimAny, getFileName, getFileExt, removeControlChars}