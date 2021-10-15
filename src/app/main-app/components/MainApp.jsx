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

        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        } = await connectWalletAndGetContract()

        // const provider = new ethers.providers.JsonRpcProvider()
        // const market = new ethers.Contract(address, abi, provider)

        await _getActiveSales({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
            gameItemContract,
        })

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
        const reqApprove = await _approveAddress({
            signerAddress,
            marketCont,
            gameItemContract,
        })
        console.log({ reqApprove })
        if (!reqApprove) {
            throw new Error('Not approve!')
        }

        const tokenIdList = [1, 2, 3]
        await _createSales({
            tokenIds: tokenIdList,
            signerAddress,
            marketCont,
            gameItemContract,
        })

        return
        const saleId = -1
        const price = '10'
        await _purchaseSale({ saleId, price, marketCont, tokenCont })
    }

    const _createSales = async ({
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
        // console.log('Check res', res)
    }

    const _approveAddress = async ({
        signerAddress,
        marketCont,
        gameItemContract,
    }) => {
        isApproved = await gameItemContract?.isApprovedForAll(
            signerAddress,
            marketCont?.address
        )
        console.log({ isApproved })

        if (!isApproved) {
            const approval = await gameItemContract?.approveAddress(
                marketCont?.address
            )
            console.log('Check approval = ', approval)
        }
        return isApproved
    }

    const _getActiveSales = async ({
        marketCont,
        tokenCont,
        signerAddress,
        gameItemContract,
    }) => {
        const activeSales = await marketCont?.getActiveSales()
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
                const uriOfNft = await gameItemContract?.tokenURI(1)
                console.log('Check uriOfNft = ' + uriOfNft)
                return {
                    ...item,
                    URI: uriOfNft,
                    contractAddress: '',
                    tokenId,
                }
            })
        )

        console.log({ activeSalesFull })
        dispatch(MainAppActions.setState({ activeSales: activeSalesFull }))

        // get balance of HOWL token
        // const howlTokenBalance = ethers.utils.formatEther(
        //     await tokenCont?.balanceOf(signerAddress)
        // )
        // console.log('Check howlTokenBalance')
        // console.log(parseInt(howlTokenBalance))
    }

    const _getInactiveSales = async ({ marketCont }) => {
        const inactiveSales = await marketCont?.getInactiveSales()
        console.log({ inactiveSales })

        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        console.log({ userCreatedSales })

        dispatch(
            MainAppActions.setState({
                inactiveSales,
                userPurchasedSales,
                userCreatedSales,
            })
        )
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
