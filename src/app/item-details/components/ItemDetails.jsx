import { useEffect, useState } from 'react'
import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import connectWallet from 'app/main-app/wallet'
import { routes } from 'config/routes'
import { ItemConfigs, Loading, NftImage, RatingView, TitleTokenIdSeller } from 'app/components'
import classNames from 'classnames'
import { configs } from 'config/config'

const InfoPages = ({ description }) => {
    // console.log('Check description = ' + description)
    const borderBottomColor = 'white'
    return (
        <div className="InfoPagesContainer flex flex-col w-full items-center sm:items-start max-w-sm mt-4 px-6 sm:px-0">
            <div className="InfoPageItem flex flex-col font-semibold">
                <div className="text-lg text-white mt-4 sm:mt-0">
                    {'Details'}
                </div>
                <div
                    className="flex mt-2.5 w-14"
                    style={{
                        backgroundColor: borderBottomColor,
                    }}
                />
            </div>
            <div className="InfoPageItemContent flex flex-col">
                <p className="flex text-white break-all text-center sm:text-left">{description}</p>
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
        // console.log({ walletInfo })
        _connectWalletAndSaveGlobal()
    }, [])

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
            await purchaseToken.wait() // waiting create transaction
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
        // toast.dismiss()
        // toast.success('Connect wallet successfully!')
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
        if (loading) {
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

    const hoverAnim = 'transition duration-300 ease-in-out 0'

    return (
        <div className="flex flex-row mt-8">
            <button
                onClick={_onClickBuy}
                className={classNames(
                    'flex justify-center items-center w-80 h-16 px-4 py-2 rounded-xl border-Blue-1 border-2 hover:bg-Blue-1',
                    hoverAnim
                )}>
                <div className="flex text-xl text-semibold text-white">
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
    }, [itemSelect, route])

    return (
        <div className="flex flex-1 flex-col pt-16">
            <div className="flex flex-col md:flex-row self-center">
                <div className="flex flex-col">
                    <TitleTokenIdSeller/>
                    <NftImage imageUri={itemSelect?.image} />
                    <ItemConfigs/>
                </div>

                {/* <Image src={itemImageSrc} alt="Picture of the author" className="ItemImage flex" /> */}
                <div className="flex flex-col justify-center items-center sm:items-start mt-16 md:ml-16 md:mt-0 pb-12 sm:pb-0">
                    <p className="flex text-white text-3xl font-semibold">
                        {itemSelect?.name}
                    </p>
                    <div className="flex flex-row text-white mt-2 sm:mt-0">
                        <p className="flex">{'20 of 25 available'}</p>
                    </div>
                    <RatingView numberStar={4} />
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
