import { useRouter } from 'next/dist/client/router'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { useGlobal } from 'reactn'
import { globalKeys } from 'config/globalKeys'
import connectWallet from '../../main-app/wallet'
import { marketAddress, nftAddress } from '../../../../deployed_address.json'
import nftAbi from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import { routes } from 'config/routes'
import { configs, tokenContract } from 'config/config'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'

const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const route = useRouter()
    const [loading, setLoading] = useState()
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    React.useEffect(() => {
        if (route.pathname === routes.mainApp) {
            _getContractFromProvider()
        }
    }, [route?.pathname])

    React.useEffect(() => {
        _getContractFromProvider()
    }, [])

    const _getContractFromProvider = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            configs.Networks.BscTestnet.RPCEndpoints
        )
    }

    return (
        <div className="flex flex-1 justify-center items-center px-12">
            <h1 className="flex text-white font-bold text-4xl text-center">
                Marketplace here
            </h1>
        </div>
    )
}

export default Container
