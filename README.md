# Live data (hot patches) downloader
## How it works?
The main anime games have a:
- main game package (one big zip)
- language packages (also big zips)
- hdiff packages for the main and language packages
- live updates (aka hot patches) 

## What is the benefit for you?
If you wish bring back Nilou banner (in version 3.1) - you can download live-update and put it to the game folder and get happiness

## How to install and start?
1) Install `nodejs` (search how to install on Windows, Linux, MacOS, etc)
2) Change `mainUrl` to a workable url (but you can keep "as is")
3) Change `versions` (if you really want to use some different versions) in the `loader.js`
4) Run terminal in the project folder (mouse right-click and run terminal)
5) Run `npm install`
6) Run `node loader.js` if you want to download files from the live updates by version numbers and prefixes
7) Run `node links-loader.js` if you want to download files from simple links in multiple `.txt` files inside `links` folder (you need to create this folder and put multiple `.txt` files with direct links to game files)
8) Run `node server.js` to start local http server to allow you to connect your game to your update server (it seems you can use it for android apk to download android/data/*** in old versions if you have live data)
9) Data will gradually be loaded into the `downloads` folder in the same directory
10) Do whatever you want with data