import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

import connectWallet from '../wallet'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
    const [loadingState, setLoadingState] = useState('not-loaded')

    let marketplaceContract, gameItemContract, signer, howlTokenContract, signerAddress, isApproved

    useEffect(async () => {
        let res = await connectWallet()
        marketplaceContract = res.marketplaceContract
        gameItemContract = res.gameItemContract
        signer = res.signer
        howlTokenContract = res.howlTokenContract
        signerAddress = await signer.getAddress()

        _init()
        loadUserNFTs()
        
        await approve()
        //await createSale()
        //await purchaseSale()
    }, [])

    const createSale = async () => {
        // create sales with tokenId 1,2,3
        if (!isApproved) throw new Error('not approve')
        const res = await Promise.all(
            [1, 2, 3].map(async tokenId => {
                const ownerOfToken = await gameItemContract.ownerOf(tokenId)
                // check if the seller is the owner of this token
                // if true then the seller can sell
                // else return error
                if (ownerOfToken == signerAddress) {
                    try {
                        const createdSale =
                            await marketplaceContract.createSale(
                                tokenId,
                                ethers.utils.parseEther('10')
                            )
                        console.log({ createdSale })
                    } catch (err) {
                        console.log(err?.data?.message)
                    }
                } else {
                    console.log('not owner of tokenId')
                }
            })
        )
    }

    const approve = async () => {
        isApproved = await gameItemContract.isApprovedForAll(
            signerAddress,
            marketplaceContract.address
        )
        console.log({isApproved})
        if (!isApproved) {
            const approval = await gameItemContract.approveAddress(
                marketplaceContract.address
            )
            console.log({ approval })
        }
    }

    const purchaseSale = async () => {
        // buy token
        try {
            const approveAllowance = await howlTokenContract.approve(
                marketplaceContract.address,
                ethers.utils.parseEther('10')
            )
            console.log({ approveAllowance })

            const purchaseToken = await marketplaceContract.purchaseSale(
                /*saleId=*/ 1,
                /*price=*/ ethers.utils.parseEther('10')
            )
            console.log({ purchaseToken })
        } catch (err) {
            console.log(err?.data?.message)
        }
    }

    const loadUserNFTs = async () => {
        const price = await marketplaceContract.getListingPrice()
        console.log(price)

        const nfts = await marketplaceContract.getUserNFTs()
        console.log({ nfts })

        dispatch(MainAppActions.setMyAssetNfts(nfts))

        const activeSales = await marketplaceContract.getActiveSales()
        console.log({ activeSales })

        //const inactiveSales = await marketplaceContract.getInactiveSales()
        //console.log({ inactiveSales })

        // get balance of HOWL token
        const howlTokenBalance = ethers.utils.formatEther(
            await howlTokenContract.balanceOf(signerAddress)
        )
        console.log(parseInt(howlTokenBalance))

        const userPurchasedSales =
            await marketplaceContract.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketplaceContract.getUserCreatedSales()
        console.log({ userCreatedSales })
    }

    // useEffect(() => {
    //     _logMainAppContext()
    // }, [state])

    // const _logMainAppContext = () => {
    //     console.log(`App new state: ${JSON.stringify(state)}`)
    // }

    const _init = () => {
        dispatch(MainAppActions.sayHello(999))
    }

    return (
        <div className="flex flex-1 flex-col bg-hwl-gray-1 MainApp">
            <MainAppHead />
            <MainAppNav />
            <MainAppBody {...{ pageProps, Component }} />
            <MainAppFooter />
        </div>
    )
}

export default MainApp
