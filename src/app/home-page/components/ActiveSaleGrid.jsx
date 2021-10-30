import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useGlobal } from 'reactn'

import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'

import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { NftCard } from '../../components'
import QuickFilterBar from './QuickFilterBar'

const ActiveSaleGrid = ({ isLoading, data }) => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const [state, dispatch] = useMainAppContext()
    const { activeSales: dataList = [] } = state

    console.log({ isLoading })
    console.log({ dataList })

    if (!Array.isArray(dataList) || (!isLoading && dataList.length === 0)) {
        return (
            <div className="flex flex-1 bg-hwl-gray-2 justify-center items-center">
                <p className="flex text-3xl sm:text-5xl text-white font-bold text-center leading-10">
                    All bikes are sold out 🎉🎉🎉 <br /> see you next time!
                </p>
            </div>
        )
    }

    return (
        <div className="first-letter:bg-hwl-gray-1 flex flex-1 flex-col">
            {/* <QuickFilterBar /> */}
            <div className="flex flex-wrap p-4">
                {Array.isArray(dataList) &&
                    dataList.map((item, index) => {
                        if (!item) return null
                        // console.log({ item })
                        const {
                            buyer,
                            isActive,
                            isSold,
                            price,
                            saleId,
                            lastUpdated,
                            seller,
                            tokenId,
                            length,
                            URI,
                            contractAddress,
                        } = item
                        const tokenIdString = item?.tokenId?.toString()
                        const itemKey = `NftCard-${tokenIdString}`
                        // console.log('Check price = ' + price)
                        return (
                            <NftCard
                                key={itemKey}
                                URI={URI}
                                contractAddress={contractAddress}
                                tokenId={tokenId}
                                price={price}
                                index={index}
                                onClick={({ nft }) => {
                                    route.push(routes.itemDetails)
                                    setItemSelect({
                                        ...nft,
                                        saleId,
                                        buyer,
                                        isActive,
                                        isSold,
                                        price,
                                        seller,
                                    })
                                }}
                            />
                        )
                    })}
            </div>
        </div>
    )
}

ActiveSaleGrid.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.array,
}

ActiveSaleGrid.defaultProps = {
    isLoading: false,
    data: [],
}

export default ActiveSaleGrid
