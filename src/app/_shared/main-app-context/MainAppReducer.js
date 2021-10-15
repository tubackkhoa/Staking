import mainAppInitState from './mainAppInitState'
import { sayHello, setMyAssetNfts, setState } from './main-app-reducers'
import MainAppActionTypes from './MainAppActionTypes'

const MainAppReducer = (state, action) => {
    const { type, payload = {} } = action
    const _state = { ...(state || mainAppInitState) }

    if (type === MainAppActionTypes.SAY_GREETING)
        return sayHello(_state, { type, payload })

    if (type === MainAppActionTypes.SET_MY_ASSET_NFTS)
        return setMyAssetNfts(_state, { type, payload })

    if (type === MainAppActionTypes.SET_STATE)
        return setState(_state, { type, payload })

    return state
}

export default MainAppReducer
