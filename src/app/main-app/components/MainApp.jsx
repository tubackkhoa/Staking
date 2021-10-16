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
import { globalKeys } from 'app/store'
import { utils } from 'utils'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
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

        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        })

        // const provider = new ethers.providers.JsonRpcProvider()
        // const market = new ethers.Contract(address, abi, provider)

        await _createTestActiveSale({
            marketCont: marketplaceContract,
            gameItemContract,
            signerAddress,
        })

        await _getActiveSales({
            marketCont: marketplaceContract,
            tokenCont: howlTokenContract,
            signerAddress,
            gameItemContract,
        })

        await _getInactiveSales({
            marketCont: marketplaceContract,
        })
    }

    const connectWalletAndGetContract = async () => {
        let walletInfo = await connectWallet()
        // console.log({ walletInfo })
        const signerAddress = await walletInfo.signer.getAddress()
        console.log({ signerAddress })
        return {
            ...walletInfo,
            signerAddress,
        }
    }

    const _createTestActiveSale = async ({
        marketCont,
        gameItemContract,
        signerAddress,
    }) => {
        const reqApprove = await _approveAddress({
            signerAddress,
            marketCont,
            gameItemContract,
        })
        console.log({ reqApprove })
        if (!reqApprove) {
            toast.error(`Address not approve, can't create test active sales!`)
            return
        }

        const tokenIdList = [1, 2, 3]
        await _createSale({
            tokenIds: tokenIdList,
            signerAddress,
            marketCont,
            gameItemContract,
        })

        return
    }

    const _createSale = async ({
        tokenIds = [],
        signerAddress,
        marketCont,
        gameItemContract,
    }) => {
        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
            console.log('Invalid tokenIds!')
            return
        }
        if (!isApproved) {
            toast.error(`Address not approve, can't create new active sale!`)
            return
        }
        
        const res = await Promise.all(
            tokenIds.map(async tokenId => {
                const ownerOfTokenAddress = await gameItemContract?.ownerOf(
                    tokenId
                )
                // console.log({ ownerOfTokenAddress })
                // check if the seller is the owner of this token
                // if true then the seller can sell
                // else return error
                if (ownerOfTokenAddress === signerAddress) {
                    try {
                        const initPrice = `${utils.getRandom(20, 30)}`
                        // console.log('Check initPrice = ' + initPrice)
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
        // console.log({ isApproved })

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
                const uriOfNft = await gameItemContract?.tokenURI(1)
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
        console.log('Check balanceFloat = ' + balanceFloat)
    }

    const _getInactiveSales = async ({ marketCont }) => {
        const inactiveSales = await marketCont?.getInactiveSales()
        // console.log({ inactiveSales })

        const userPurchasedSales = await marketCont?.getUserPurchasedSales()
        // console.log({ userPurchasedSales })

        const userCreatedSales = await marketCont?.getUserCreatedSales()
        // console.log({ userCreatedSales })

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
