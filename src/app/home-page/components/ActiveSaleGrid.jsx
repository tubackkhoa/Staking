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

const ActiveSaleGrid = ({ isLoading, data, onClickItem }) => {
    const route = useRouter()

    if (isLoading) {
        return (
            <div className="flex flex-1 bg-black justify-center items-center">
                <div className="flex items-center justify-center ">
                    <div className="w-40 h-40 border-t-4 border-b-4 border-green-900 rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (!Array.isArray(data) || (!isLoading && data.length === 0)) {
        return (
            <div className="flex flex-1 bg-hwl-gray-2 justify-center items-center">
                <p className="flex text-3xl sm:text-5xl text-white font-bold text-center leading-snug">
                    All bikes on market are sold out 🎉🎉🎉 <br /> See you next time!
                </p>
            </div>
        )
    }

    return (
        <div className="first-letter:bg-hwl-gray-1 flex flex-1 flex-col px-24">
            <div className="flex flex-wrap p-4">
                {data.map((item, index) => {
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
                                    onClickItem({
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
    onClickItem: PropTypes.func,
}

ActiveSaleGrid.defaultProps = {
    isLoading: false,
    data: [],
    onClickItem: () => undefined,
}

export default ActiveSaleGrid
