
import MainAppActionTypes from '../MainAppActionTypes'

const setMyAssetNfts = (nfts) => {
    return {
        type: MainAppActionTypes.SET_MY_ASSET_NFTS,
        payload: { nfts },
    }
}

export default setMyAssetNfts