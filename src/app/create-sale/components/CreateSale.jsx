import { useEffect, useState } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import connectWallet from 'app/main-app/wallet'
import { routes } from 'config/routes'
import { Loading } from 'app/components'

const ItemRating = ({ numberStar = 5 }) => {
    return (
        <div className="flex flex-row">
            {Array(numberStar)
                .fill(0)
                .map((item, index) => {
                    return (
                        <div
                            key={`renderStars${index}`}
                            className="flex w-12 h12 mr-3">
                            <img
                                style={{ width: '50px', height: '50px' }}
                                src={icons.star}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

const CreatorView = () => {
    return (
        <div className="flex flex-row items-center mt-4">
            <img
                alt="creator-avatar"
                className="CreatorAvatar flex"
                src={icons.instagram}
            />
            <div className="flex flex-col text-white ml-4">
                <h6 className="flex text-sm">{'Creator'}</h6>
                <h6>{'Manhnd'}</h6>
            </div>
        </div>
    )
}

const InfoPages = ({ description }) => {
    // console.log('Check description = ' + description)
    const borderBottomColor = 'white'
    return (
        <div className="InfoPagesContainer flex flex-col w-full">
            <div className="InfoPageHeader flex flex-row text-white w-full">
                <div className="InfoPageItem flex flex-col font-semibold">
                    <a>{'Details'}</a>
                    <div
                        className="flex mt-0.5"
                        style={{
                            width: '54px',
                            marginTop: '10px',
                            backgroundColor: borderBottomColor,
                        }}
                    />
                </div>
            </div>
            <div className="InfoPageItemContent flex flex-col">
                <p className="flex text-white">{description}</p>
            </div>
        </div>
    )
}

const CreateSaleButton = ({ tokenId, price }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    // console.log('Check walletInfo = ', walletInfo)
    let isApproved = false

    // useEffect(()=>{
    //     console.log('Check new walletInfo = ', walletInfo);
    // }, [walletInfo])

    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    const _connectWalletAndSaveGlobal = async ({ autoReCreateSale }) => {
        const wallet = await connectWallet()
        toast.dismiss()
        toast.success('Connect wallet successfully, please try your create sale again!')
        // console.log('check my-assets _getData', { wallet })

        if (!wallet) {
            toast.error('Connect wallet failed!')
            return
        }

        if (autoReCreateSale) {
            _onClickCreateSale()
        }

        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        } = wallet

        const signerAddress = await signer?.getAddress()

        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        })

        return {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        }
    }

    const _onClickCreateSale = async () => {
        // toast.info('Confirm your transaction!')
        console.log({ walletInfo })
        if (!walletInfo || !walletInfo.signer) {
            toast.info('Please connect your metamask wallet!')
            await _connectWalletAndSaveGlobal({ autoReCreateSale: false })
            return
        }
        // return
        const signerAddress =
            walletInfo?.signerAddress ||
            (await walletInfo?.signer?.getAddress())
        console.log({ signerAddress })
        const weiBigNumber = await tokenCont?.balanceOf(signerAddress) // is an BigNumberish
        console.log({ weiBigNumber }) //
        // _hex: "0x019d971e4fe8401e74000000"
        // _isBigNumber: true

        // get balance of HOWL token
        const howlTokenBalanceWeiInt = parseInt(
            ethers.utils.formatEther(weiBigNumber)
        )
        console.log({ howlTokenBalanceWeiInt }) // 500000000

        console.log({ price }) // is BigNumber
        // const priceInt = ethers.utils.formatEther(price)
        // console.log({ priceInt })

        // const priceInHwl = priceInt / howlTokenBalanceWeiInt
        // console.log({ priceInHwl })

        const reqApprove = await _approveAddress({
            signerAddress,
            marketCont,
            gameItemContract: walletInfo?.gameItemContract,
        })

        await _createSale(
            tokenId,
            price,
            signerAddress,
            marketCont,
            walletInfo?.gameItemContract
        )
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
            isApproved = true
            // console.log('Check approval = ', approval)
        }
        return isApproved
    }

    const _createSale = async (
        tokenId,
        price,
        signerAddress,
        marketCont,
        gameItemContract
    ) => {
        setLoading(true)
        // console.log('Check _createSale tokenId = ' + tokenId)
        // console.log('Check _createSale price = ' + price)
        
        console.log({ gameItemContract })
        const ownerOfTokenAddress = await gameItemContract?.ownerOf(tokenId)
        console.log({ ownerOfTokenAddress })
        // check if the seller is the owner of this token
        // if true then the seller can sell
        // else return error
        if (ownerOfTokenAddress === signerAddress) {
            try {
                // const initPrice = `${utils.getRandom(20, 30)}`
                console.log('Check price = ' + price)
                console.log({ marketCont })
                const createdSale = await marketCont?.createSale(
                    tokenId,
                    ethers.utils.parseEther(price)
                )
                toast.success('Create sale successfully!')
                console.log({ createdSale })
                setLoading(false)
                setTimeout(()=>{
                    route.push(routes.mainApp)
                },2000)
            } catch (err) {
                setLoading(false)
                toast.error(`Create sale failed, ${err?.data?.message}`)
                console.log(err)
            }
        } else {
            toast.warning(
                `Not owner of tokenId \n Your address is ${signerAddress} \n Owner of token address is ${ownerOfTokenAddress}`
            )
            console.log(`Not owner of tokenId ${signerAddress}`)
        }
    }

    // if (!price) return null

    // console.log(price)
    // const priceInHwl = ethers.utils.formatEther(price)
    // console.log('Check priceInHwl = ' + priceInHwl)

    return (
        <button
            onClick={_onClickCreateSale}
            className="flex h-12 max-w-7xl bg-Blue-1 flex-row justify-center items-center rounded-lg mt-6 transition duration-300 ease-in-out hover:bg-blue-500 transform hover:-translate-y-1">
            <div className="flex text-xl text-semibold text-white">
                {`Create sale`}
            </div>
            {!!loading && <Loading className="ml-4" />}
        </button>
    )
}

const CreateSale = () => {
    const [myAssetSelect, setMyAssetSelect] = useGlobal(
        globalKeys.myAssetSelect
    )
    const [priceInput, setPriceInput] = useState(0)
    const route = useRouter()

    useEffect(() => {
        console.log(
            'Check new myAssetSelect = ' + JSON.stringify(myAssetSelect)
        )
        if (!myAssetSelect) {
            route.back()
            return
        }
    }, [myAssetSelect])

    const renderInputItemPrice = () => {
        return (
            <div className="flex flex-col">
                <div className="flex text-white text-lg font-semibold">
                    Price
                </div>
                <input
                    // type={"number"}
                    // defaultValue={priceInput}
                    className="flex text-white font-semibold text-xl outline-none bg-Gray-2 h-12 w-auto max-w-7xl px-4 rounded-lg mt-6"
                    placeholder={'Enter Price'}
                    onChange={event => {
                        setPriceInput(event.target.value)
                    }}
                />
            </div>
        )
    }

    // console.log({ myAssetSelect })

    return (
        <div className="ItemSelectedContainer flex flex-1 flex-col pt-16">
            <div className="flex flex-row self-center">
                <img
                    className="flex w-96 h-96 rounded-3xl transition-all"
                    src={myAssetSelect?.image}
                    alt="main-item-image"
                />
                {/* <Image src={itemImageSrc} alt="Picture of the author" className="ItemImage flex" /> */}
                <div className="ItemInfoBlock flex flex-col ml-16">
                    <div className="ItemName flex text-white">
                        {myAssetSelect?.name}
                    </div>
                    <ItemRating numberStar={4} />
                    <InfoPages description={myAssetSelect?.description} />
                    <div className="flex w-auto h-px bg-Gray-2 my-4" />
                    {renderInputItemPrice()}
                    <CreateSaleButton
                        tokenId={myAssetSelect?.tokenId}
                        price={priceInput}
                    />
                </div>
            </div>
        </div>
    )
}

export default CreateSale
