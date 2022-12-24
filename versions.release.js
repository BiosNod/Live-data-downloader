/**
 Original source: https://github.com/BiosNod/Live-data-loader.git

 🧡 Bring back some data for your game and have fun
 Our discord invite: https://discord.gg/MfxYRNdD9x

 🧡 Please make pull request to the original repository if you have {client, version, suffix} from other versions

 {Client type, version, suffix} you can retrieve from dispatch (when login) from:
 https://oseurodispat**.yuansh**.com/query_cur_region?version=OSRELWin2.8.0&lang=1&platform=1&binary=1&time=90&channel_id=1&sub_channel_id=1&account_type=1&dispatchSeed=xxxxxx
 You need to decrypt response by key (yes, it's encrypted, before 3.2 use key 3, from 3.2 it's key 5)
 If you dunno about query_cur_region, about keys and how to decrypt the response - ask in #support or #development

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
 OSRELWin3.2.0_R11611027:8bf0cf5f3d_S11212885:766b0a2560_D11793813:1bb7eba264
 OSRELWin3.3.0_R11972804:a46af65d51_S11938958:b040c0ebeb_D11990274:d46e5e55e2 - day1 hotfix
 OSRELWin3.3.0_R11972804:a46af65d51_S11938958:b040c0ebeb_D12100776:793a112718 - maybe BP issue fix?
 *
 * Short pattern:
 * ${buildName}${version}_R${resClientVersion}:${resClientSuffix}_S${silentClientVersion}:${silentClientSuffix}_D${clientVersion}:${clientSuffix}
 *
 * Long pattern:
 * @type {{"version_live": [{res: {Suffix: string, Version: number}, clientSilence: {Suffix: string, Version: number}, client: {Suffix: string, Version: number}}]}}
 */

const list =
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
                res: {Version: 2484655, Suffix: "d25bf77fa4"},
                clientSilence: {Version: 2494513, Suffix: "3ddaee14c9"},
                client: {Version: 2502139, Suffix: "d0d890eb69"},
            },

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

        '3.2_live': [
            {
                res: {Version: 11149961, Suffix: "d6b14858bc"},
                clientSilence: {Version: 11212885, Suffix: "766b0a2560"},
                client: {Version: 11319614, Suffix: "f9c5287efd"},
            },

            {
                res: {Version: 11353770, Suffix: "6428631800"},
                client: {Version: 11364183, Suffix: "175a3e3bff"},
            },

            {
                client: {Version: 11404032, Suffix: "d92901d0b2"},
            },

            {
                res: {Version: 11611027, Suffix: "8bf0cf5f3d"},
                client: {Version: 11793813, Suffix: "1bb7eba264"},
            },
        ],

        '3.3_live': [
            {
                res: {Version: 11972804, Suffix: "a46af65d51"},
                clientSilence: {Version: 11938958, Suffix: "b040c0ebeb"},
                client: {Version: 12136874, Suffix: "f3a4b38d81"},
            },
        ],

        '3.4_live': [
            {
                res: {Version: 11994380, Suffix: "6091cf4556"},
                clientSilence: {Version: 12103638, Suffix: "774f2bebb4"},
                client: {Version: 12117976, Suffix: "9ddf06370b"},
            },
        ],
    }

module.exports = {list}