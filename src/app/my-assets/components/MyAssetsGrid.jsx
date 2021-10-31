import { useEffect } from 'react'
import { useGlobal } from 'reactn'
import PropTypes from 'prop-types'

import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'

import { Loading, NftCard } from '../../components'

const MyAssetsGrid = ({ isLoading }) => {
    const route = useRouter()
    const [myAssetSelect, setMyAssetSelect] = useGlobal(
        globalKeys.myAssetSelect
    )
    const [state, dispatch] = useMainAppContext()
    const { nfts = [] } = state

    useEffect(()=>{
        console.log('Check new nfts = ' + JSON.stringify(nfts))
    },[nfts])

    console.log({ isLoading })

    if (isLoading) {
        return (
            <div className="flex flex-1 bg-hwl-gray-1">
                <Loading size={8} />
            </div>
        )
    }

    return (
        <div className="first-letter:bg-hwl-gray-1">
            <div className="flex flex-wrap flex-1 p-4">
                {Array.isArray(nfts) &&
                    nfts.map((item, index) => {
                        if (!item) return null
                        console.log('Check new item = ' + JSON.stringify(item))
                        const tokenIdString = item.tokenId.toString()
                        const itemKey = `NftCard-${tokenIdString}`
                        const { URI, contractAddress, tokenId } = item

                        return (
                            <NftCard
                                key={itemKey}
                                URI={URI}
                                showPrice={false}
                                contractAddress={contractAddress}
                                tokenId={tokenId}
                                index={index}
                                onClick={({ nft }) => {
                                    route.push(routes.createSale)
                                    // console.log('Check nft = ', nft)
                                    setMyAssetSelect({
                                        ...nft,
                                        ...item,
                                    })
                                }}
                            />
                        )
                    })}
            </div>
        </div>
    )
}

MyAssetsGrid.propTypes = {
    isLoading: PropTypes.bool,
}

MyAssetsGrid.defaultProps = {
    isLoading: false,
}

export default MyAssetsGrid
