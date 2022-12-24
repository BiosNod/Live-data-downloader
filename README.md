# Live data (hot patches) downloader
## How it works?
The main anime games have a:
- main game package (one big zip)
- language packages (also big zips)
- hdiff packages for the main game and language packages (hdiff zips)
- live updates (aka hot patches, downloading in the game) 

## What is the benefit for you?
If you wish bring back Nilou banner (in version 3.1 banners phase 2) - you can download live-hotfix .blk and put it to the game folder and get happiness

## How to install and start?
1) Install `nodejs` (search how to install on Windows, Linux, MacOS, etc)
2) Change `mainUrl` in `loader.js` to a workable url (but you can keep "as is")
3) Change versions and suffixes in `versions.release.js` (if you really want to use some different versions) in the `loader.js`
4) Run terminal in the project folder (mouse right-click and run terminal)
5) Run `npm install`
6) Run `node loader.js` if you want to download files from the live updates by version numbers and prefixes using `versions.release.js`
7) Run `node links-loader.js` if you want to download files from the simple links in multiple `.txt` files inside `links` folder (you should create this folder and put multiple `.txt` files with direct http/https links to game files)
8) Run `node server.js` to start local http server to emulate update server using downloaded data. You can connect your game to this update server using modded query region (it seems you can use it for android apk to download android/data/*** in old versions if you have live data)
9) Data will gradually be loaded into the `downloads` folder in the same directory
10) Do whatever you want with data

## Note
When downloading files are written directly to the disk to `.~tmp` files (without RAM) to `downloads` (not system `downloads`, only nearby script). Then the temporary extension is removed after full download.
You can turn off the Internet or press the `Ctrl + C` to stop and later continue automatically downloading `.~tmp` files from the last bytes. Don't delete `.~tmp` files if you want to resume! Just start `loader.js` or `links-loader.js` again!