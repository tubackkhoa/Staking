import { useEffect, useState } from 'react'

import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

import connectWallet from '../wallet'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
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

        const nfts = await marketplaceContract.getUserNFTs()
        console.log({ nfts })

        dispatch(MainAppActions.setMyAssetNfts(nfts))

        // console.log('tokenId', nft[0].tokenId.toNumber())
        // console.log('URI', nft[0].URI)

        const activeSales = await marketplaceContract.getActiveSales()
        console.log({ activeSales })

        const inactiveSales = await marketplaceContract.getInactiveSales()
        console.log({ inactiveSales })

        const userPurchasedSales = await marketplaceContract.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketplaceContract.getUserCreatedSales()
        console.log({ userCreatedSales })

        const numToken = await gameItemContract.balanceOf(
            await signer.getAddress()
        )
        console.log({ numToken })
        
        // const resCreateSale = await marketplaceContract.createSale({

        // })
    }

    // useEffect(() => {
    //     _logMainAppContext()
    // }, [state])

    // const _logMainAppContext = () => {
    //     console.log(`App new state: ${JSON.stringify(state)}`)
    // }

    const _init = () => {
        dispatch(MainAppActions.sayHello(999))
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
