/**
 Original source: https://github.com/BiosNod/Live-data-loader.git

 🧡 Bring back some data for your game and have fun
 Our discord invite: https://discord.gg/MfxYRNdD9x

 {Client type, version, suffix} you can retrieve from dispatch (when login) from:
 https://oseurodispat**.yuansh**.com/query_cur_region?version=OSRELWin2.8.0&lang=1&platform=1&binary=1&time=90&channel_id=1&sub_channel_id=1&account_type=1&dispatchSeed=xxxxxx
 You need to decrypt response by key (yes, it's encrypted, before 3.2 use key 3, from 3.2 it's key 5)
 If you dunno about query_cur_region, about keys and how to decrypt the response - ask in #support or #development

 🧡 Please make pull request to the original repository if you have {client, version, suffix} from other versions

 Pattern:
 ${buildName}${version}_R${resClientVersion}:${resClientSuffix}_S${silentClientVersion}:${silentClientSuffix}_D${clientVersion}:${clientSuffix}

 Known list:
 OSRELWin1.4.0_R2381708:53b1e84ce4_S2396714:52338ab3d4_D2396714:52338ab3d4
 OSRELWin1.5.0_R2663089:25a12eeea5_S2771742:99f775138c_D2762856:4ebb02e19b
 OSRELWin1.5.0_R2775769:c196739952_S2785677:dd8d2f28b5_D2780670:19133fa79e
 OSRELWin1.5.0_R2775769:c196739952_S2797188:f772fde953_D2808729:7a9522338e
 OSRELWin1.5.0_R2866676:eaf0bb745e_S2901119:aae6a5b3eb_D2934686:907ecc1dcb
 OSRELWin1.6.1_R3305047:ecff173daf_S3266913:b1501b6955_D3353303:242157b1de
 OSRELWin1.6.1_R3557509:5979a935f8_S3266913:b1501b6955_D3526661:2b3db51945
 OSRELWin2.0.0_R3696781:eb2d9ce860_S3774214:ef5e090f93_D3774214:ef5e090f93
 OSRELWin3.0.0_R10283122:ec58ff372e_S10446836:320895326e_D10316937:4fcac11e23
 OSRELWin3.1.0_R10676272:ab446cd9d8_S10660688:b69559f811_D10693398:99e1a99fd2
 OSRELWin3.1.0_R10676272:ab446cd9d8_S10660688:b69559f811_D10772333:09136b2529
 OSRELWin3.1.0_R10676272:ab446cd9d8_S10805493:3222597d09_D10772333:09136b2529
 OSRELWin3.1.0_R10916590:847ba6bd45_S10805493:3222597d09_D10941477:af48dac880
 OSRELWin3.2.0_R11149961:d6b14858bc_S11212885:766b0a2560_D11319614:f9c5287efd
 OSRELWin3.2.0_R11353770:6428631800_S11212885:766b0a2560_D11364183:175a3e3bff
 OSRELWin3.2.0_R11353770:6428631800_S11212885:766b0a2560_D11404032:d92901d0b2
 */

const fs = require('fs')
const helpers = require("./helpers");

// You need to replace this link to real without stars
const mainUrl = "https://autopatchhk.yuanshen.com"

const versions =
    {
        '1.0_live': [
            {
                res: {Version: 1284249, Suffix: "ba7ad33643"},
                clientSilence: {Version: 1393824, Suffix: "52338ab3d4"},
                client: {Version: 1358691, Suffix: "52338ab3d4"},
            },
        ],

        '1.4_live': [
            {
                res: {Version: 2381708, Suffix: "53b1e84ce4"},
                clientSilence: {Version: 2396714, Suffix: "52338ab3d4"},
                client: {Version: 2396714, Suffix: "52338ab3d4"},
            },
        ],

        '1.5_live': [
            {
                res: {Version: 2663089, Suffix: "25a12eeea5"},
                clientSilence: {Version: 2771742, Suffix: "99f775138c"},
                client: {Version: 2762856, Suffix: "4ebb02e19b"},
            },

            {
                res: {Version: 2775769, Suffix: "c196739952"},
                clientSilence: {Version: 2785677, Suffix: "dd8d2f28b5"},
                client: {Version: 2780670, Suffix: "19133fa79e"},
            },

            {
                clientSilence: {Version: 2797188, Suffix: "f772fde953"},
                client: {Version: 2808729, Suffix: "7a9522338e"},
            },

            {
                res: {Version: 2866676, Suffix: "eaf0bb745e"},
                clientSilence: {Version: 2901119, Suffix: "aae6a5b3eb"},
                client: {Version: 2934686, Suffix: "907ecc1dcb"},
            },
        ],

        '1.6_live': [
            {
                res: {Version: 3305047, Suffix: "ecff173daf"},
                clientSilence: {Version: 3266913, Suffix: "b1501b6955"},
                client: {Version: 3353303, Suffix: "242157b1de"},
            },

            {
                res: {Version: 3557509, Suffix: "5979a935f8"},
                client: {Version: 3526661, Suffix: "2b3db51945"},
            },
        ],

        '2.7_live': [
            {
                res: {Version: 6855943, Suffix: "1490a59df9"},
                clientSilence: {Version: 6801534, Suffix: "69e473b331"},
                client: {Version: 6902895, Suffix: "d6252eb166"},
            }
        ],

        '3.0_live': [
            {
                // base version with sound data in AudioAssets (Japanese, Korean, etc...)
                res: {Version: 9624836, Suffix: "ed0599bc5b"},
            },

            {
                res: {Version: 10283122, Suffix: "ec58ff372e"},
                clientSilence: {Version: 10446836, Suffix: "320895326e"},
                client: {Version: 10316937, Suffix: "4fcac11e23"},
            }
        ],

        '3.1_live': [
            {
                res: {Version: 10345388, Suffix: "db455059e3"},
                clientSilence: {Version: 10289512, Suffix: "36a8dc6d48"},
                client: {Version: 10350544, Suffix: "7a97cd5fbb"},
            },

            {
                // base version with sound data in AudioAssets (Japanese, Korean, etc...)
                res: {Version: 10457664, Suffix: "3bdde23eb8"},
            },

            {
                res: {Version: 10676272, Suffix: "ab446cd9d8"},
                clientSilence: {Version: 10660688, Suffix: "b69559f811"},
                client: {Version: 10693398, Suffix: "99e1a99fd2"},
            },

            {
                clientSilence: {Version: 10660688, Suffix: "b69559f811"},
                client: {Version: 10772333, Suffix: "09136b2529"},
            },

            {
                clientSilence: {Version: 10805493, Suffix: "3222597d09"},
                client: {Version: 10772333, Suffix: "09136b2529"},
            },

            {
                res: {Version: 10916590, Suffix: "847ba6bd45"},
                clientSilence: {Version: 10805493, Suffix: "3222597d09"},
                client: {Version: 10941477, Suffix: "af48dac880"},
            }
        ],

        '3.4_live': [
            {
                res: {Version: 11994380, Suffix: "6091cf4556"},
                clientSilence: {Version: 12103638, Suffix: "774f2bebb4"},
                client: {Version: 12117976, Suffix: "9ddf06370b"},
            },
        ],
    }

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
    for (const [version, versionDatas] of Object.entries(versions))
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