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
            {Array(numberStar).fill(0).map((item, index) => {
                    return (
                        <div key={`renderStars${index}`} className="flex w-12 h12 mr-3">
                            <img style={{ width: '50px', height: '50px' }} src={icons.star} />
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

const CreateSaleButton = ({ saleId, price }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    console.log('Check walletInfo = ', walletInfo)

    // useEffect(()=>{
    //     console.log('Check new walletInfo = ', walletInfo);
    // }, [walletInfo])

    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    const _purchaseSale = async ({ saleId, marketCont, tokenCont }) => {
        if (!saleId || saleId === -1) {
            return
        }
        setLoading(true)
        console.log('Check run _purchaseSale')
        // buy token
        try {
            const unlimitedAllowance =
                '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            const allowance = await tokenCont?.allowance(
                walletInfo?.signer?.getAddress(),
                marketCont.address
            )
            if (allowance.lt(price)) {
                const approveAllowance = await tokenCont?.approve(
                    marketCont.address,
                    unlimitedAllowance
                )
                console.log({ approveAllowance })
            }

            const purchaseToken = await marketCont.purchaseSale(
                /*saleId=*/ saleId
            )
            await purchaseToken.wait()
            setLoading(false)
            console.log({ purchaseToken })
            toast.success(`Purchase sale NFT successfully!`)
            setTimeout(() => {
                route.push(routes.myAssets)
            }, 2000)
        } catch (err) {
            console.log(err)
            setLoading(false)
            toast.dismiss()
            toast.error(
                `Purchase sale failed with error ${err?.data?.message}!`
            )
            console.log(err?.data?.message)
        }
    }

    const _connectWalletAndSaveGlobal = async () => {
        const wallet = await connectWallet()
        toast.dismiss()
        toast.success('Connect wallet successfully!')
        console.log('check my-assets _getData', { wallet })

        if (!wallet) {
            toast.error('Connect wallet failed!')
            return
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

    const onClickCreateSale = async () => {
        // toast.info('Confirm your transaction!')
        console.log({ walletInfo })

        if (!walletInfo || !walletInfo.signer) {
            toast.info('Please connect your metamask wallet!')
            await _connectWalletAndSaveGlobal()
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
        const priceInt = ethers.utils.formatEther(price)
        console.log({ priceInt })

        const priceInHwl = priceInt / howlTokenBalanceWeiInt
        console.log({ priceInHwl })
        _purchaseSale({
            saleId,
            tokenCont: tokenCont,
            marketCont: marketCont,
        })
    }

    // if (!price) return null

    // console.log(price)
    // const priceInHwl = ethers.utils.formatEther(price)
    // console.log('Check priceInHwl = ' + priceInHwl)

    return (
        <button onClick={onClickCreateSale} className="flex h-12 max-w-7xl bg-Blue-1 flex-row justify-center items-center rounded-lg mt-4">
            <div className="flex text-xl text-semibold text-white">
                {`Create sale`}
            </div>
            {!!loading && <Loading className="ml-4" />}
        </button>
    )
}

const CreateSale = () => {
    const [myAssetSelect, setMyAssetSelect] = useGlobal(globalKeys.myAssetSelect)
    const [priceInput, setPriceInput] = useState(0)
    const route = useRouter()

    useEffect(() => {
        console.log('Check new myAssetSelect = ' + JSON.stringify(myAssetSelect))
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
                />
            </div>
        )
    }

    return (
        <div className="ItemSelectedContainer flex flex-1 flex-col pt-16">
            <div className="ItemSelected flex flex-row self-center">
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
                        saleId={myAssetSelect?.saleId}
                        price={myAssetSelect?.price}
                    />
                </div>
            </div>
        </div>
    )
}

export default CreateSale
