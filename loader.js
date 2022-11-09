/**
 * Original source: https://github.com/BiosNod/Live-data-loader.git
 * 🧡 Bring back some data for your game and have fun
 */

const download = require('download')
const fs = require('fs')

// You need to replace this link to real without stars
const mainUrl = "https://autopatch**.yuansh**.co*"

// This data (client type, version, suffix) you can retrieve from dispatch (when login):
// https://oseurodispat**.yuansh**.co*/query_cur_region?version=OSRELWin2.8.0&lang=1&platform=1&binary=1&time=90&channel_id=1&sub_channel_id=1&account_type=1&dispatchSeed=xxxxxx
// You need to decrypt response by key (yes, it's encrypted, before 3.2 use key 3, from 3.2 it's key 5)
// If you dunno about query_cur_region, about keys and how to decrypt the response - ask in #support or #development
//
// 🧡 Please make pull request to the original repository if you have {client, version, suffix} from other versions
const versions =
    {
        '2.7_live':
            {
                client: {Version: 6902895, Suffix: "d6252eb166"},
                clientSilence: {Version: 6801534, Suffix: "69e473b331"},
                res: {Version: 6855943, Suffix: "1490a59df9"}
            },

        '3.1_live':
            {
                client: {Version: 10350544, Suffix: "7a97cd5fbb"},
                clientSilence: {Version: 10289512, Suffix: "36a8dc6d48"},
                res: {Version: 10345388, Suffix: "db455059e3"}
            },
    }

const paths =
    {
        client: {
            Mode: 'client_design_data',
            Clients: ['client/General/AssetBundles'],
            Mappers: ['data_versions']
        },

        clientSilence: {
            Mode: 'client_design_data',
            Clients: ['client_silence/General/AssetBundles'],
            Mappers: ['data_versions']
        },

        res: {
            Mode: 'client_game_res',
            Clients: ['client/StandaloneWindows64', 'client/Android', 'client/iOS', 'client/PS5', 'client/PS4'],
            Mappers: [
                'res_versions_external',
                'res_versions_medium',
                'res_versions_streaming',
                'release_res_versions_external',
                'release_res_versions_medium',
                'release_res_versions_streaming',
                'base_revision'
            ]
        }
    }

const resolvers =
    {
        AudioAssets: ['pck'],
        VideoAssets: ['cuepoint', 'usm'],
        AssetBundles: ['blk'],
        // other have a root / folder
    };


(async () => {
    for (const [version, versionData] of Object.entries(versions))
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

                    console.log(mapperUrl)

                    if (!fs.existsSync(saveFilePath)) {
                        fs.mkdirSync(saveFileFolder, {recursive: true})
                        console.log(`downloading ${mapperUrl}`)
                        fs.writeFileSync(saveFilePath, await download(mapperUrl))
                    }

                    const mapperLines = fs.readFileSync(saveFilePath).toString().split("\n")

                    for (const line of mapperLines) {
                        if (!line) continue

                        const mapperData = JSON.parse(line)

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

                        const tmpFileSavePath = `${saveFileFolder}/${extFolder}/${mapperData.remoteName}`

                        if (!fs.existsSync(tmpFileSavePath)) {
                            const tmpFileSaveFolder = tmpFileSavePath.split('/').slice(0, -1).join('/')
                            fs.mkdirSync(tmpFileSaveFolder, {recursive: true})

                            const tmpFileUrl = `${mainUrl}/${fileFolder}/${extFolder}/${mapperData.remoteName}`.replace(`${fileFolder}//`, `${fileFolder}/`)
                            console.log(`downloading ${tmpFileUrl}`)
                            fs.writeFileSync(tmpFileSavePath, await download(tmpFileUrl))
                        }
                    }
                }
        }
})()