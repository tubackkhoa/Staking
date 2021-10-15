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
    // const [isApproved, setApproved] = useState(false)
    let isApproved = false

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        console.log('Check in getData')
        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        } = await connectWalletAndGetContract()

        console.log({ marketplaceContract })

        // await _getMyAssets({
        //     marketCont: marketplaceContract,
        //     tokenCont: howlTokenContract,
        //     signerAddress,
        // })

        await _testCreateActiveSale({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            gameItemContract,
            signerAddress,
        })
    }

    const connectWalletAndGetContract = async () => {
        let walletInfo = await connectWallet()
        console.log({ walletInfo })
        const signerAddress = await walletInfo.signer.getAddress()
        console.log({ signerAddress })
        return {
            ...walletInfo,
            signerAddress,
        }
    }

    const _testCreateActiveSale = async ({
        marketCont,
        gameItemContract,
        tokenCont,
        signerAddress,
    }) => {
        console.log('Check _testCreateActiveSale', { signerAddress, marketCont, gameItemContract })
        const reqApprove = await _approveAddress({ signerAddress, marketCont, gameItemContract })
        console({ reqApprove })
        if(!reqApprove){
            throw new Error('Not approve!')
        }

        const tokenIdList = [1,2,3,4,5]
        await createSales({
            tokenIds: tokenIdList,
            signerAddress,
            marketCont,
            gameItemContract,
        })

        return
        const saleId = -1
        const price = '10'
        await purchaseSale({ saleId, price, marketCont, tokenCont })
    }

    const createSales = async ({
        tokenIds = [],
        signerAddress,
        marketCont,
        gameItemContract,
    }) => {
        console.log('Check in createSales')
        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
            console.log('Invalid tokenIds!')
            return
        }
        // create sales with tokenId 1,2,3
        if (!isApproved) throw new Error('not approve')
        const res = await Promise.all(
            tokenIds.map(async tokenId => {
                const ownerOfTokenAddress = await gameItemContract?.ownerOf(
                    tokenId
                )
                console.log({ ownerOfTokenAddress })
                // check if the seller is the owner of this token
                // if true then the seller can sell
                // else return error
                if (ownerOfTokenAddress === signerAddress) {
                    try {
                        const initPrice = '10'
                        const createdSale = await marketCont?.createSale(
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
        console.log('Check res', res)
    }

    const _approveAddress = async ({
        signerAddress,
        marketCont,
        gameItemContract,
    }) => {
        console.log('Check approveAddress')
        console.log('Check signerAddress = ' + signerAddress)
        
        isApproved = await gameItemContract?.isApprovedForAll(
            signerAddress,
            marketCont?.address
        )
        console.log({ isApproved })

        if (!isApproved) {
            console.log('Check isApproved === false', gameItemContract)
            console.log('Check marketCont', marketCont)
            const approval = await gameItemContract?.approveAddress(
                marketCont?.address
            )
            console.log('Check approval = ', approval)
        }
        
        return isApproved
    }

    const purchaseSale = async ({
        saleId = -1,
        price = '10',
        marketCont,
        tokenCont,
    }) => {
        if (!saleId || saleId === -1) {
            return
        }
        // buy token
        try {
            const approveAllowance = await tokenCont?.approve(
                marketCont.address,
                ethers.utils.parseEther(price)
            )
            console.log({ approveAllowance })

            const purchaseToken = await marketCont.purchaseSale(
                /*saleId=*/ saleId,
                /*price=*/ ethers.utils.parseEther(price)
            )
            console.log({ purchaseToken })
        } catch (err) {
            console.log(err?.data?.message)
        }
    }

    const _getMyAssets = async ({ marketCont, tokenCont, signerAddress }) => {
        console.log({ marketCont })
        const price = await marketCont?.getListingPrice()
        // console.log({ price })

        const nfts = await marketCont?.getUserNFTs()
        // console.log({ nfts })

        dispatch(MainAppActions.setMyAssetNfts(nfts))

        const activeSales = await marketCont?.getActiveSales()

        // console.log({ activeSales })

        // each active sale, get uri by tokenURI func - param: tokenId
        // const url = await gameItemContract.tokenURI(1)

        // get available

        const inactiveSales = await marketCont?.getInactiveSales()
        console.log({ inactiveSales })

        // get balance of HOWL token
        const howlTokenBalance = ethers.utils.formatEther(
            await tokenCont?.balanceOf(signerAddress)
        )
        // console.log(parseInt(howlTokenBalance))

        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        console.log({ userCreatedSales })
    }

    // useEffect(() => {
    //     _logMainAppContext()
    // }, [state])

    // const _logMainAppContext = () => {
    //     console.log(`App new state: ${JSON.stringify(state)}`)
    // }

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
