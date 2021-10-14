import { useEffect } from 'react'
import React, { useGlobal } from 'reactn'

import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'

import { NftItem } from '../../components'

const MyAssetsGrid = () => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const [state, dispatch] = useMainAppContext()
    const { nfts = [] } = state

    return (
        <div className="first-letter:bg-hwl-gray-1 HomePage flex flex-1">
            <div className="NftItems flex flex-wrap flex-1 justify-center p-4">
                {Array.isArray(nfts) && nfts.map((item, index) => {
                    if (!item) return null
                    const tokenIdString = item.tokenId.toString()
                    const itemKey = `NftItem-${tokenIdString}`
                    return (
                        <NftItem
                            key={itemKey}
                            item={item}
                            index={index}
                            onClick={({ nft }) => {
                                route.push(routes.itemDetails)
                                setItemSelect(nft)
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default MyAssetsGrid
