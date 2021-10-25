import { useRouter } from 'next/dist/client/router'
import { ethers } from 'ethers'
import React from 'react'
import ActiveSaleGrid from './ActiveSaleGrid'
import LeftSideBar from './LeftSideBar'
import { useGlobal } from 'reactn'
import { globalKeys } from 'config/globalKeys'
import connectWallet from '../../main-app/wallet'
import { marketAddress, nftAddress } from '../../../../deployed_address.json'
import MarketplaceAbi from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import nftAbi from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import { routes } from 'config/routes'
import { configs } from 'config/config'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'

const Container = props => {
    const [state, dispatch] = useMainAppContext()
    const route = useRouter()
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    React.useEffect(() => {
        if(route.pathname === routes.mainApp){
            _getData()
        }
    }, [route.pathname])

    React.useEffect(() => {
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
        <>
            <LeftSideBar />
            <ActiveSaleGrid />
        </>
    )
}

export default Container
