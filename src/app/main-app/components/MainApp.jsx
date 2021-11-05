import React from 'react'
import { ethers } from 'ethers'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'
import { useGlobal } from 'reactn'
import { globalKeys } from 'config/globalKeys'
import { configs } from 'config/config'

import MarketplaceAbi from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import nftAbi from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import { marketAddress, nftAddress } from '../../../../deployed_address.json'
import { checkNetworkAndRequest } from 'services'

const MainApp = ({ pageProps, Component }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    React.useEffect(() => {
        _getContractFromProvider()
        // checkNetworkAndRequest()
    }, [])

    const _getContractFromProvider = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            configs.Networks.BscTestnet.RPCEndpoints
        )
        const marketContract = new ethers.Contract(
            marketAddress,
            MarketplaceAbi?.abi,
            provider
        )
        const gameItemContract = new ethers.Contract(
            nftAddress,
            nftAbi.abi,
            provider
        )
        setWalletInfo({
            ...walletInfo,
            marketplaceContract: marketContract,
            gameItemContract: gameItemContract,
        })
    }

    return (
        <div className="flex flex-1 flex-col bg-hwl-gray-1">
            <ToastContainer />
            <div className="MainApp flex flex-col">
                <MainAppHead />
                <MainAppNav />
                <MainAppBody {...{ pageProps, Component }} />
            </div>
            <MainAppFooter />
        </div>
    )
}

export default MainApp
