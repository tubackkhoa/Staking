import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

import connectWallet from '../wallet'
import { useGlobal } from 'reactn'
import { globalKeys } from 'config/globalKeys'
import { utils } from 'utils'

import { marketAddress, nftAddress } from '../../../../deployed_address.json'
import MarketplaceAbi from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import nftAbi from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import { useRouter } from 'next/dist/client/router'
import { routes } from 'config/routes'
import { configs } from 'config/config'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    let isApproved = false

    useEffect(() => {
        if(route.pathname === routes.mainApp){
            _getData()
        }
    }, [route.pathname])

    useEffect(() => {
        _getData()
    }, [])

    const _getData = async () => {
        const provider = new ethers.providers.JsonRpcProvider(configs.testnetBSC)
        const marketContract = new ethers.Contract(
            marketAddress,
            MarketplaceAbi.abi,
            provider
        )
        const gameItemContract = new ethers.Contract(
            nftAddress,
            nftAbi.abi,
            provider
        )

        setWalletInfo({
           marketplaceContract: marketContract,
           gameItemContract: gameItemContract,
           signer: null,
           howlTokenContract: null,
           signerAddress: null,
        })

        await _getActiveSales({
            marketCont: marketContract,
            gameItemContract,
        })

        await _getInactiveSales({
            marketCont: marketContract,
        })
    }

    const connectWalletAndGetContract = async () => {
        let walletInfo = await connectWallet()
        // console.log({ walletInfo })
        const signerAddress = await walletInfo.signer.getAddress()
        // console.log({ signerAddress })
        return {
            ...walletInfo,
            signerAddress,
        }
    }

    const _getActiveSales = async ({ marketCont, gameItemContract }) => {
        const activeSales = await marketCont?.getActiveSales()
        
        // const activeSales = await marketCont?.getActiveSalesByPage(0,3)
        console.log({ activeSales })

        const activeSalesFull = await Promise.all(
            activeSales.map(async item => {
                const {
                    buyer,
                    isActive,
                    isSold,
                    price,
                    saleId,
                    lastUpdated,
                    seller,
                    tokenId,
                    length,
                } = item
                // each active sale, get uri by tokenURI func - param: tokenId
                console.log('Check tokenId = ' + tokenId?.toNumber());
                 // get uri of json file
                const uriOfNft = await gameItemContract?.tokenURI(tokenId)
                // console.log({ uriOfNft })
                // show tokenId, seller
                return {
                    ...item,
                    URI: uriOfNft,
                    contractAddress: '',
                    tokenId,
                }
            })
        )
        // console.log({ activeSalesFull })
        dispatch(MainAppActions.setState({ activeSales: activeSalesFull }))
    }

    const _getBalanceOfToken = async () => {
        // get balance of HOWL token
        const balance = ethers.utils.formatEther(
            await tokenCont?.balanceOf(signerAddress)
        )
        const balanceFloat = parseFloat(howlTokenBalance)
        // console.log('Check balanceFloat = ' + balanceFloat)
    }

    const _getInactiveSales = async ({ marketCont }) => {
        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        console.log({ userCreatedSales })

        dispatch(
            MainAppActions.setState({
                userPurchasedSales,
                userCreatedSales,
            })
        )
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
