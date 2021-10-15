import { useEffect } from 'react'
import { ethers } from 'ethers'

import connectWallet from 'app/main-app/wallet'
import MyAssetsGrid from './MyAssetsGrid'
import { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'

const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    useEffect(() => {
        _getData()
    }, [])

    const _getData = async () => {
        const walletInfo = await connectWallet()
        console.log({ walletInfo })

        if (!walletInfo) {
            console.log('connectWallet failed!')
            return
        }
        
        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        } = walletInfo

        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        })

        const signerAddress = await signer?.getAddress()
        
        await _getMyAssets({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
        })
    }

    const _getMyAssets = async ({ marketCont, tokenCont, signerAddress }) => {
        console.log({ marketCont })
        const listingPrice = await marketCont?.getListingPrice()
        console.log({ listingPrice })

        const nfts = await marketCont?.getUserNFTs()
        console.log({ nfts })

        dispatch(MainAppActions.setMyAssetNfts(nfts))

        const activeSales = await marketCont?.getActiveSales()
        console.log({ activeSales })

        // each active sale, get uri by tokenURI func - param: tokenId
        // const url = await gameItemContract.tokenURI(1)

        // get available

        const inactiveSales = await marketCont?.getInactiveSales()
        console.log({ inactiveSales })

        // get balance of HOWL token
        const howlTokenBalance = ethers.utils.formatEther(
            await tokenCont?.balanceOf(signerAddress)
        )
        // console.log(parseInt(howlTokenBalance))

        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        console.log({ userCreatedSales })
    }

    return (
        <>
            <MyAssetsGrid />
        </>
    )
}

export default Container
