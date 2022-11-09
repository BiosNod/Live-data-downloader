# Live data (hot patches) downloader
## How it works?
The main anime games have a:
- main game package (one big zip)
- language packages (also big zips)
- hdiff packages for the main and language packages
- live updates (aka hot patches) 

## What is the benefit for you?
If you wish bring back Nil** banner (in version 3.1) - you can download live-update and put it to the game folder and get happiness

## How to install and start?
1) Install nodejs (search how to install on Windows, Linux, MacOS, etc)
2) Change "mainUrl" and "versions" in the loader.js
3) Run terminal in the project folder (mouse right-click and run terminal)
4) Run "npm install"
5) Run "node loader.js"
6) Data will gradually be loaded into the "downloads" folder in the same directory