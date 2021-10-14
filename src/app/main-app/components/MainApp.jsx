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

    let marketplaceContract
    let gameItemContract
    let signer
    let howlTokenContract
    let signerAddress
    let isApproved

    useEffect(() => {
        autoConnectAndCreateSales()
    }, [])

    const autoConnectAndCreateSales = async () => {
        let res = await connectWallet()
        marketplaceContract = res.marketplaceContract
        gameItemContract = res.gameItemContract
        signer = res.signer
        howlTokenContract = res.howlTokenContract
        signerAddress = await signer.getAddress()

        _init()
        getMyAssets()

        // await approveAddress()
        // const tokenIdList = [1, 2, 3]
        // await createListSale({ tokenIds: tokenIdList })

        //await purchaseSale()
    }

    const createListSale = async ({ tokenIds = [] }) => {
        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
            console.log('Invalid tokenIds!')
            return
        }
        // create sales with tokenId 1,2,3
        if (!isApproved) throw new Error('not approve')
        const res = await Promise.all(
            tokenIds.map(async tokenId => {
                const ownerOfTokenAddress = await gameItemContract.ownerOf(
                    tokenId
                )

                // check if the seller is the owner of this token
                // if true then the seller can sell
                // else return error
                if (ownerOfTokenAddress === signerAddress) {
                    try {
                        const initPrice = '10'
                        const createdSale =
                            await marketplaceContract.createSale(
                                tokenId,
                                ethers.utils.parseEther(initPrice)
                            )
                        console.log({ createdSale })
                    } catch (err) {
                        console.log(err?.data?.message)
                    }
                } else {
                    console.log('Not owner of tokenId')
                }
            })
        )
    }

    const approveAddress = async () => {
        isApproved = await gameItemContract.isApprovedForAll(
            signerAddress,
            marketplaceContract.address
        )
        console.log({ isApproved })
        if (!isApproved) {
            const approval = await gameItemContract.approveAddress(
                marketplaceContract.address
            )
            console.log({ approval })
        }
    }

    const purchaseSale = async ({ saleId = -1, price = '10' }) => {
        if (!saleId || saleId === -1) {
            return
        }
        // buy token
        try {
            const approveAllowance = await howlTokenContract.approve(
                marketplaceContract.address,
                ethers.utils.parseEther(price)
            )
            console.log({ approveAllowance })

            const purchaseToken = await marketplaceContract.purchaseSale(
                /*saleId=*/ saleId,
                /*price=*/ ethers.utils.parseEther(price)
            )
            console.log({ purchaseToken })
        } catch (err) {
            console.log(err?.data?.message)
        }
    }

    const getMyAssets = async () => {
        const price = await marketplaceContract.getListingPrice()
        console.log(price)

        const nfts = await marketplaceContract.getUserNFTs()
        console.log({ nfts })

        dispatch(MainAppActions.setMyAssetNfts(nfts))

        const activeSales = await marketplaceContract.getActiveSales()

        console.log({ activeSales })

        // each active sale, get uri by tokenURI func - param: tokenId
        // const url = await gameItemContract.tokenURI(1)

        // get available

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
        <div className="flex flex-1 flex-col bg-hwl-gray-1">
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
