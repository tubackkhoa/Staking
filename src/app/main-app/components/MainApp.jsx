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

const MainApp = ({ pageProps, Component }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    React.useEffect(() => {
        _getContractFromProvider()
        _requestChangeNetwork()
    }, [])

    const _requestChangeNetwork = async () => {
        console.log('Check in _requestChangeNetwork')
        // Check if MetaMask is installed
        // MetaMask injects the global API into window.ethereum
        if (window && window.ethereum) {
            try {
                // check if the chain to connect to is installed
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: configs.Networks.BscTestnet.ChainId.hex }], // // chainId must be in hexadecimal numbers
                })
            } catch (error) {
                // This error code indicates that the chain has not been added to MetaMask
                // if it is not, then install it into the user MetaMask
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: configs.Networks.BscTestnet.ChainId.hex,
                                    rpcUrl: configs.Networks.BscTestnet.RPCEndpoints,
                                },
                            ],
                        })
                    } catch (addError) {
                        console.error(addError)
                    }
                }
                console.error(error)
            }
        } else {
            // if no window.ethereum then MetaMask is not installed
            alert(
                'Bạn chưa càiMetaMask, cài đặt ví tại: https://metamask.io/download.html'
            )
        }
    }

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
