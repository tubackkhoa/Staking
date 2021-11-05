import { useEffect } from 'react'
import { useGlobal } from 'reactn'
import PropTypes from 'prop-types'

import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'

import { Loading, NftCard, ActivityIndicator } from '../../components'

const MyAssetsGrid = ({ isLoading, data }) => {
    const route = useRouter()
    const [myAssetSelect, setMyAssetSelect] = useGlobal(
        globalKeys.myAssetSelect
    )

    useEffect(() => {
        console.log('Check new data = ' + JSON.stringify(data))
    }, [data])

    if (isLoading) {
        return <ActivityIndicator/>
    }

    if (!Array.isArray(data) || (data.length === 0)) {
        return (
            <div className="flex flex-1 bg-hwl-gray-2 justify-center items-center">
                <p className="flex text-3xl sm:text-5xl text-white font-bold text-center leading-snug mx-1">
                    You do not have a motorbike yet 🏍️ <br /> Buy one at the Store page!
                </p>
            </div>
        )
    }

    return (
        <div className="first-letter:bg-hwl-gray-1">
            <div className="block sm:flex w-screen sm:w-full overflow-scroll flex-nowrap sm:flex-wrap p-4 px-4 sm:px-24 mt-8">
                {Array.isArray(data) &&
                    data.map((item, index) => {
                        if (!item) return null
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
    data: PropTypes.array,
}

MyAssetsGrid.defaultProps = {
    isLoading: false,
    data: [],
}

export default MyAssetsGrid
