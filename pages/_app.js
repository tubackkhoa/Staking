import MainAppContainer from 'app/main-app'
import 'styles/index.scss'
import React, { setGlobal } from 'reactn'
import { globalKeys } from 'config/globalKeys'

setGlobal({
    [globalKeys.walletInfo]: {
        signer: null,
        dnftTokenContract: null,
    },
})

export default MainAppContainer
