import { useEffect } from 'react'
import QuickFilterBar from './QuickFilterBar'
import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import React, { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'
import { NftItem } from '../../components'

const ActiveSaleGrid = () => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const [state, dispatch] = useMainAppContext()
    const { activeSales: dataList = [] } = state

    return (
        <div className="first-letter:bg-hwl-gray-1 flex flex-col flex-1 ActiveSaleGridContainer">
            {/* <QuickFilterBar /> */}
            <div className="flex flex-1 flex-wrap p-4">
                {Array.isArray(dataList) && dataList.map((item, index) => {
                    if (!item) return null
                    // console.log({ item })
                    const { buyer, isActive, isSold, price, saleId, lastUpdated, seller, tokenId, length, URI, contractAddress } = item
                    const tokenIdString = item?.tokenId?.toString()
                    const itemKey = `NftItem-${tokenIdString}`
                    // console.log('Check price = ' + price)
                    return (
                        <NftItem
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

export default ActiveSaleGrid
