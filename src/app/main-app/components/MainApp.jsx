import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

import connectWallet from '../wallet'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        _init()
        loadUserNFTs()
    }, [])

    const loadUserNFTs = async () => {
        const { marketplaceContract, gameItemContract, signer } =
            await connectWallet()

        const price = await marketplaceContract.getListingPrice()
        console.log(price)

        const nft = await marketplaceContract.getUserNFTs()
        console.log(nft)

        // console.log('tokenId', nft[0].tokenId.toNumber())
        // console.log('URI', nft[0].URI)

        const test2 = await marketplaceContract.getActiveSales()
        console.log(test2)

        const test3 = await marketplaceContract.getInactiveSales()
        console.log(test3)

        const test4 = await marketplaceContract.getUserPurchasedSales()
        console.log(test4)

        const test5 = await marketplaceContract.getUserCreatedSales()
        console.log(test5)

        const numToken = await gameItemContract.balanceOf(
            await signer.getAddress()
        )
        console.log({ numToken })
    }

    useEffect(() => {
        _logMainAppContext()
    }, [state])

    const _logMainAppContext = () => {
        console.log(`App state: ${JSON.stringify(state)}`)
    }

    const _init = () => {
        dispatch(MainAppActions.sayHello())
    }

    return (
        <div className="flex flex-1 flex-col bg-hwl-gray-1 MainApp">
            <MainAppHead />
            <MainAppNav />
            <MainAppBody {...{ pageProps, Component }} />
            <MainAppFooter />
        </div>
    )
}

export default MainApp
