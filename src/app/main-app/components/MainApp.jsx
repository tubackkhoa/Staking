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
import { checkNetworkAndRequest } from 'services'

import { masterChefAddress } from '../../../../deployed_address.json'

import MasterChefAbi from '../../../../artifacts/contracts/MasterChef.sol/MasterChef.json'

const MainApp = ({ pageProps, Component }) => {
    // const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    React.useEffect(() => {
        getContractFromProvider()
    }, [])

    const getContractFromProvider = async () => {
        // config here
        const provider = new ethers.providers.JsonRpcProvider(
            configs.Networks.Default.RPCEndpoints
        )

        const masterChefContract = new ethers.Contract(
            masterChefAddress,
            MasterChefAbi?.abi,
            provider
        )
        // console.log({ masterChefContract })
        configs.masterChefContract = masterChefContract

        // setWalletInfo({
        //     ...walletInfo,
        // })
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
