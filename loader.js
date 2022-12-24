/**
 Original source: https://github.com/BiosNod/Live-data-loader.git

 🧡 Bring back some data for your game and have fun
 Our discord invite: https://discord.gg/MfxYRNdD9x

 🧡 Please make pull request to the original repository if you have {client, version, suffix} from other versions

 Don't forget to change versions.release.js
 */

const fs = require('fs')
const helpers = require("./helpers");

// You need to replace this link to real without stars
const mainUrl = "https://autopatchhk.yuanshen.com"

// You can change versions to some another list, like "./versions.beta" if you have beta list 👀
const versions = require('./versions.release')

const paths =
    {
        res: {
            Mode: 'client_game_res',
            Clients: ['client/Android', 'client/StandaloneWindows64', 'client/iOS', 'client/PS5', 'client/PS4'],
            Mappers: [
                'res_versions_external',
                'res_versions_medium',
                'res_versions_streaming',
                'release_res_versions_external',
                'release_res_versions_medium',
                'release_res_versions_streaming',
                'base_revision',
                'script_version',
                'AudioAssets/audio_versions',
            ]
        },

        clientSilence: {
            Mode: 'client_design_data',
            Clients: ['client_silence/General/AssetBundles'],
            Mappers: ['data_versions']
        },

        client: {
            Mode: 'client_design_data',
            Clients: ['client/General/AssetBundles'],
            Mappers: ['data_versions']
        },
    }

const resolvers =
    {
        AudioAssets: ['pck'],
        VideoAssets: ['cuepoint', 'usm'],
        AssetBundles: ['blk'],
        // other have a root / folder
    };

if (mainUrl.indexOf('*') > -1) {
    console.log("Please replace the mainUrl to real URL without stars (*)")
    return
}

(async () => {
    for (const [version, versionDatas] of Object.entries(versions.list))
        for (const versionData of versionDatas)
            for (const [liveType, liveData] of Object.entries(versionData)) {
                const pathData = paths[liveType]
                for (const client of pathData.Clients)
                    for (const mapper of pathData.Mappers) {
                        /*
                        Examples for the mappers:

                        ${mainUrl}/client_design_data/3.1_live/output_10941477_af48dac880/client/General/AssetBundles/data_versions
                        ${mainUrl}/client_design_data/3.1_live/output_10805493_3222597d09/client_silence/General/AssetBundles/data_versions
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/res_versions_external
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/res_versions_medium
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/res_versions_streaming
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/release_res_versions_external
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/release_res_versions_medium
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/release_res_versions_streaming
                        ${mainUrl}/client_game_res/3.1_live/output_10916590_847ba6bd45/client/Android/base_revision

                        Examples for the files from mappers:

                        ${mainUrl}/client_design_data/2.7_live/output_6801534_69e473b331/client/General/AssetBundles/blocks/00/24230448.blk
                        ${mainUrl}/client_design_data/2.7_live/output_6801534_69e473b331/client_silence/General/AssetBundles/blocks/00/22551915.blk
                        [attention: first blk from the "client/General/AssetBundles/data_versions", second blk from the "client_silence/General/AssetBundles/data_versions"]
                        ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/Android/ctable.dat
                        ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/Android/hardware_model_config.json
                        ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/Android/VideoAssets/Android/Cs_Inazuma_AQ202004_ResistanceCharge_Girl.usm
                        ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/Android/AudioAssets/Streamed9.pck
                        ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/Android/VideoAssets/MDAQ001_OPNew_Part1.cuepoint
                         */

                        const fileFolder = `${pathData.Mode}/${version}/output_${liveData.Version}_${liveData.Suffix}/${client}`
                        const mapperUrl = `${mainUrl}/${fileFolder}/${mapper}`

                        const saveFileFolder = `${__dirname}/downloads/${fileFolder}`
                        const saveFilePath = `${saveFileFolder}/${mapper}`

                        await helpers.forceDownload(mapperUrl, saveFilePath)

                        // There are no JSON
                        if (['script_version', 'base_revision'].includes(mapper)) continue

                        const mapperLines = fs.readFileSync(saveFilePath).toString().split("\n")

                        for (const line of mapperLines) {
                            if (!line) continue

                            const mapperData = helpers.getMd5Data(line)

                            // Fix 404:
                            // ${mainUrl}/client_game_res/2.7_live/output_6855943_1490a59df9/client/StandaloneWindows64/svc_catalog
                            if (mapperData.remoteName === 'svc_catalog') continue

                            const ext = mapperData.remoteName.split('.').pop()
                            let extFolder = ''

                            for (const [resolveFolder, resolveExts] of Object.entries(resolvers))
                                if (resolveExts.includes(ext)) {
                                    extFolder = resolveFolder
                                    break
                                }

                            if (!extFolder)
                                console.log(`Can't detect extFolder for ext: ${ext}, remoteName: ${mapperData.remoteName}, it's OK but check it yourself. In the current case saving to the root folder instead of extFolder`)

                            /*
                            Remove extFolder Because general mappers already have it in URL

                            General mappers:
                            ${mainUrl}/client_design_data/3.1_live/output_10941477_af48dac880/client/General/AssetBundles/data_versions,
                            ${mainUrl}/client_design_data/3.1_live/output_10805493_3222597d09/client_silence/General/AssetBundles/data_versions,

                            Files from general mappers:
                            ${mainUrl}/client_design_data/2.7_live/output_6801534_69e473b331/client/General/AssetBundles/blocks/00/24230448.blk
                            ${mainUrl}/client_design_data/2.7_live/output_6801534_69e473b331/client_silence/General/AssetBundles/blocks/00/22551915.blk
                             */
                            if (extFolder && saveFileFolder.indexOf(extFolder) > -1)
                                extFolder = ''

                            const gameFileSavePath = `${saveFileFolder}/${extFolder}/${mapperData.remoteName}`
                            const gameFileUrl = `${mainUrl}/${fileFolder}/${extFolder}/${mapperData.remoteName}`.replace(`${fileFolder}//`, `${fileFolder}/`)

                            await helpers.forceDownload(gameFileUrl, gameFileSavePath)
                        }
                    }
            }

    console.log('Done ^_^')
})()