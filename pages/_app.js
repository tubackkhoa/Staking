import MainAppContainer from 'app/main-app'
import 'styles/index.scss'
import React, { setGlobal } from 'reactn'
import { globalKeys } from 'app/store'

setGlobal({
    [globalKeys.itemSelect]: null,
    [globalKeys.walletInfo]: null,
})

export default MainAppContainer
