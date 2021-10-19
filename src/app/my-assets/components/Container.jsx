import { useEffect } from 'react'
import { ethers } from 'ethers'

import connectWallet from 'app/main-app/wallet'
import MyAssetsGrid from './MyAssetsGrid'
import { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import LeftSideBar from './LeftSideBar'
import { toast } from 'react-toastify'

const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    useEffect(() => {
        _getData()
    }, [])

    const _getData = async () => {
        const { marketplaceContract, howlTokenContract, signerAddress } = await _connectWalletAndSaveGlobal();
        await _getMyAssets({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
        })
    }

    const _connectWalletAndSaveGlobal = async () => {
        // toast.info('Connecting your metamask wallet!')
        const wallet = await connectWallet()
        toast.dismiss()
        // toast.success('Connect wallet successfully!')
        console.log('check my-assets _getData', { wallet })

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
            console.log({ nfts })
            dispatch(MainAppActions.setMyAssetNfts(nfts))
        } catch (error) {
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
            <LeftSideBar />
            <MyAssetsGrid />
        </>
    )
}

export default Container
