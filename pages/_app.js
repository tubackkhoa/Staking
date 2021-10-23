import MainAppContainer from 'app/main-app'
import 'styles/index.scss'
import React, { setGlobal } from 'reactn'
import { globalKeys } from 'app/store'

setGlobal({
    [globalKeys.itemSelect]: null,
    [globalKeys.walletInfo]: {
        marketplaceContract: null,
        gameItemContract: null,
        signer: null,
        howlTokenContract: null,
    },
    [globalKeys.filterActiveSale]: null,
})

export default MainAppContainer