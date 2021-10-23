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
import classNames from 'classnames'
import { configs } from 'config/config'

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

const BuyButton = ({ saleId, price }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    useEffect(() => {
        // _connectWalletAndSaveGlobal()
    })

    const _purchaseSale = async ({ saleId, marketCont, tokenCont }) => {
        if (!saleId || saleId === -1) {
            return
        }
        setLoading(true)
        console.log('Check run _purchaseSale')
        // buy token
        try {
            const allowance = await tokenCont?.allowance(
                walletInfo?.signer?.getAddress(),
                marketCont.address
            )
            if (allowance.lt(price)) {
                const approveAllowance = await tokenCont?.approve(
                    marketCont.address,
                    configs.unlimitedAllowance
                )
                await approveAllowance.wait()
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
        // console.log('check my-assets _getData', { wallet })

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

    const _onClickBuy = async () => {
        // toast.info('Confirm your transaction!')
        // console.log({ walletInfo })

        if (loading) {
            toast.warning('Please waiting ...')
            return
        }

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

    if (!price) return null

    // console.log(price)
    const priceInHwl = ethers.utils.formatEther(price)
    // console.log('Check priceInHwl = ' + priceInHwl)

    const hoverAnim =
        'transition duration-300 ease-in-out 0 transform hover:-translate-y-1'

    return (
        <div className="flex flex-row mt-8">
            <button
                onClick={_onClickBuy}
                className={classNames(
                    'flex justify-center items-center w-64 h-16 px-4 py-2 rounded-xl border-Blue-1 border-2 hover:bg-Blue-1',
                    hoverAnim
                )}>
                <div className="ActionButtonsTitle flex text-xl text-semibold text-white">
                    {`Buy for ${priceInHwl} HWL`}
                </div>
                {!!loading && <Loading className="ml-4" />}
            </button>
        </div>
    )
}

const ItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)

    const route = useRouter()
    useEffect(() => {
        // console.log('Check new itemSelect = ' + JSON.stringify(itemSelect))
        if (!itemSelect) {
            route.back()
            return
        }
        const { id, image, like, price, star, title, tokenCode, saleId } =
            itemSelect
    }, [itemSelect])

    const ItemRating = ({ numberStar = 5 }) => {
        return (
            <div className="flex flex-row">
                {Array(numberStar)
                    .fill(0)
                    .map((item, index) => {
                        return (
                            <div
                                key={`renderStars${index}`}
                                className="flex w-12 h-12 mr-2.5">
                                <img
                                    className="flex w-12 h-12"
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
                    <h6>{'Harry'}</h6>
                </div>
            </div>
        )
    }

    // const itemImageSrc = itemSelect?.image || ''

    return (
        <div className="ItemSelectedContainer flex flex-1 flex-col pt-16">
            <div className="ItemSelected flex flex-row self-center">
                <img
                    className="flex w-96 h-96 rounded-3xl transition-all"
                    src={itemSelect?.image}
                    alt="main-item-image"
                />
                {/* <Image src={itemImageSrc} alt="Picture of the author" className="ItemImage flex" /> */}
                <div className="ItemInfoBlock flex flex-col">
                    <p className="ItemName flex text-white">
                        {itemSelect?.name}
                    </p>
                    {/* <div className="flex flex-row text-white">
                        <p className="flex">{'From'}</p>
                        <p className="flex ml-0.5">{'4.5 HOWL'}</p>
                        <p className="flex">{' . '}</p>
                        <p className="flex">{'20 of 25 available'}</p>
                    </div> */}
                    <ItemRating numberStar={4} />
                    {/* <CreatorView /> */}
                    <InfoPages description={itemSelect?.description} />
                    <BuyButton
                        saleId={itemSelect?.saleId}
                        price={itemSelect?.price}
                    />
                </div>
            </div>
        </div>
    )
}

export default ItemDetails
