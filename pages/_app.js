import MainAppContainer from 'app/main-app'
import 'styles/index.scss'
import React, { setGlobal } from 'reactn'
import { globalKeys } from 'app/store'

setGlobal({
    [globalKeys.itemSelect]: null,
    [globalKeys.walletInfo]: {
        marketplaceContract: null,
        gameItemContract: null,
        s: null,
        howlTokenContract: null,
    },
})

export default MainAppContainer
