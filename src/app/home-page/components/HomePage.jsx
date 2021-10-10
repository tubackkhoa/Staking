import { useEffect } from 'react'
import QuickFilterBar from './QuickFilterBar'
import { nfts } from '../statics/dummy'
import MainAppContext from 'app/_shared/main-app-context'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { NftItem } from './NftItem'
import React, { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'

const HomePage = () => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const [state, dispatch] = useMainAppContext()
    const { nfts } = state

    // useEffect(() => {
    //     console.log('Check new state = ', state)
    // }, [state])

    return (
        <div className="first-letter:bg-hwl-gray-1 HomePage">
            <QuickFilterBar />
            <div className="NftItems flex flex-wrap">
                {nfts.map((item, index) => {
                    if (!item) return null
                    return (
                        <NftItem
                            key={item?.tokenId}
                            item={item}
                            index={index}
                            onClick={({ nft }) => {
                                route.push('./item-details')
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
