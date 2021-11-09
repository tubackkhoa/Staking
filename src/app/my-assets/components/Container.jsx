import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useGlobal } from 'reactn'

import connectWallet from 'app/main-app/wallet'
import { globalKeys } from 'config/globalKeys'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { checkNetworkAndRequest } from 'services'

import MyAssetsGrid from './MyAssetsGrid'
import { Loading } from 'app/components'
import { configs } from 'config/config'

const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const [isGetMyNfts, setGetMyNfts] = useState(false)
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const [userNfts, setUserNfts] = useState([])

    const onSuccessSwitchNetwork = () => {
        // after switch network successfully, get data again
        getDataNft()
    }

    const onFailedSwitchNetwork = () => {
        console.log('Check switch network failed!')
    }

    useEffect(() => {
        getDataNft()
        checkNetworkAndRequest({
            onSuccess: onSuccessSwitchNetwork,
            onFailed: onFailedSwitchNetwork,
        })
    }, [])

    const getDataNft = async () => {
        setGetMyNfts(true)
        const { marketplaceContract, howlTokenContract, signerAddress } =
            await _connectWalletAndSaveGlobal()

        configs.tokenContract = howlTokenContract

        await _getMyAssets({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
        })
    }

    const _connectWalletAndSaveGlobal = async () => {
        const wallet = await connectWallet()
        toast.dismiss()

        if (!wallet) {
            toast.error('Connect wallet failed!')
            return
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
        }
    }

    const _getMyAssets = async ({ marketCont, tokenCont, signerAddress }) => {
        try {
            const nfts = await marketCont?.getUserNFTs()
            setGetMyNfts(false)
            // console.log({ nfts })
            setUserNfts(nfts)
            dispatch(MainAppActions.setMyAssetNfts(nfts))
        } catch (error) {
            setGetMyNfts(false)
            toast.error(error)
        }
    }

    return (
        <>
            <MyAssetsGrid isLoading={isGetMyNfts} data={userNfts} />
        </>
    )
}

export default Container
