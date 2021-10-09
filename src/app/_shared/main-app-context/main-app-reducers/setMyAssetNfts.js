const setMyAssetNfts = (state, action) => {
    const { payload: args } = action
    const { nfts } = args

    return {
        ...state,
        nfts,
    }
}

export default setMyAssetNfts
