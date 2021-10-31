import { useRouter } from 'next/dist/client/router'
import { ethers } from 'ethers'
import React, { useState } from 'react'
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
    const [loading, setLoading] = useState()
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const { activeSales = [] } = state

    React.useEffect(() => {
        if(route.pathname === routes.mainApp){
            _getContractFromProvider()
        }
    }, [route?.pathname])

    React.useEffect(() => {
        _getContractFromProvider()
    }, [])

    const _getContractFromProvider = async () => {
        const provider = new ethers.providers.JsonRpcProvider(configs.testnetBSC)
        const marketContract = new ethers.Contract(
            marketAddress,
            MarketplaceAbi.abi,
            provider
        )
        
        const gameItemContract = new ethers.Contract(
            nftAddress,
            nftAbi?.abi,
            provider
        )

        setWalletInfo({
           marketplaceContract: marketContract,
           gameItemContract: gameItemContract,
           signer: null,
           howlTokenContract: null,
           signerAddress: null,
        })

        setLoading(true)
        await _getActiveSales({
            marketCont: marketContract,
            gameItemContract,
        })

        await _getInactiveSales({
            marketCont: marketContract,
        })
        setLoading(false)
    }

    const _getActiveSales = async ({ marketCont, gameItemContract }) => {
        if(!marketCont || typeof marketCont?.getActiveSalesByPage !== 'function') {
            // console.log({ marketCont })
            return;
        }
        // console.log({ marketCont })
        const activeSales = await marketCont?.getActiveSalesByPage(0,12)
        
        // const activeSales = await marketCont?.getActiveSalesByPage(0,3)
        // console.log({ activeSales })

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

    const _getInactiveSales = async ({ marketCont }) => {
        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        // console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        // console.log({ userCreatedSales })

        dispatch(
            MainAppActions.setState({
                userPurchasedSales,
                userCreatedSales,
            })
        )
    }

    return (
        <>
            {/* <LeftSideBar /> */}
            <ActiveSaleGrid 
                data={activeSales}
                onClickItem={(item)=> {
                    route.push(routes.itemDetails)
                    setItemSelect(item)
                }}
                isLoading={loading}
            />
        </>
    )
}

export default Container
