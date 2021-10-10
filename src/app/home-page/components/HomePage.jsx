import { useEffect } from 'react'
import QuickFilterBar from './QuickFilterBar'
import { nfts } from '../statics/dummy'
import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { NftItem } from './NftItem'
import React, { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'

const HomePage = () => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const [state, dispatch] = useMainAppContext()
    const { nfts = [] } = state

    return (
        <div className="first-letter:bg-hwl-gray-1 HomePage">
            <QuickFilterBar />
            <div className="NftItems flex flex-wrap">
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

export default HomePage
