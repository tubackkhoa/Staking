import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useGlobal } from 'reactn'

import connectWallet from 'app/main-app/wallet'

import LeftSideBar from './LeftSideBar'
import MyAssetsGrid from './MyAssetsGrid'

import { globalKeys } from 'config/globalKeys'

import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { Loading } from 'app/components'


const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const [isGetMyNfts, setGetMyNfts] = useState(false)
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    useEffect(() => {
        _getData()
    }, [])

    const _getData = async () => {
        setGetMyNfts(true)
        const { marketplaceContract, howlTokenContract, signerAddress } = await _connectWalletAndSaveGlobal();
        await _getMyAssets({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
        })
    }

    const _connectWalletAndSaveGlobal = async () => {
        const wallet = await connectWallet()
        console.log({ wallet })
        toast.dismiss()

        if (!wallet) {
            toast.error('Connect wallet failed!')
            return;
        }

        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        } = wallet

        const signerAddress = await signer?.getAddress()

        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        })

        return {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        };
    }

    const _getMyAssets = async ({ marketCont, tokenCont, signerAddress }) => {
        // const fee = await marketCont?.getFee()
        // console.log({ fee })
        // const feeFloat = ethers.utils.formatEther(fee)
        // console.log({ feeFloat })

        try {
            const nfts = await marketCont?.getUserNFTs()
            setGetMyNfts(false)
            console.log({ nfts })
            dispatch(MainAppActions.setMyAssetNfts(nfts))
        } catch (error) {
            setGetMyNfts(false)
            toast.error(error)
        }

        // const activeSales = await marketCont?.getActiveSales()
        // console.log({ activeSales })

        // each active sale, get uri by tokenURI func - param: tokenId
        // const url = await gameItemContract.tokenURI(1)

        // get available

        // const inactiveSales = await marketCont?.getInactiveSales()
        // console.log({ inactiveSales })

        // // get balance of HOWL token
        // const howlTokenBalance = ethers.utils.formatEther(
        //     await tokenCont?.balanceOf(signerAddress)
        // )
        // // console.log(parseInt(howlTokenBalance))

        // const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        // console.log({ userPurchasedSales })

        // const userCreatedSales = await marketCont?.getUserCreatedSales()
        // console.log({ userCreatedSales })
    }

    return (
        <>
            {/* <LeftSideBar /> */}
            <MyAssetsGrid isLoading={isGetMyNfts} />
        </>
    )
}

export default Container
