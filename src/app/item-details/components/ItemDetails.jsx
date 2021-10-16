import { useEffect, useState } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { dummyInfoPages } from './dummy'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

const InfoPages = () => {
    const [pages, setPages] = useState([])
    const [pageSelect, setPageSelect] = useState(null)
    useEffect(() => {
        setPages(dummyInfoPages)
        setPageSelect(dummyInfoPages[0])
    }, [])

    return (
        <div className="InfoPagesContainer flex flex-col w-full">
            <div className="InfoPageHeader flex flex-row text-white w-full">
                {pages.map((item, index) => {
                    const { id, title, content } = item
                    const isSelect = pageSelect?.id === id
                    const borderBottomColor = isSelect ? 'white' : 'transparent'
                    const titleWeight = isSelect ? 600 : 400
                    const onClick = () => {
                        setPageSelect(item)
                    }
                    return (
                        <button
                            onClick={onClick}
                            key={`InfoPages-${id}`}
                            className="InfoPageItem flex flex-col"
                            style={{ fontWeight: titleWeight }}>
                            <a>{title}</a>
                            <div
                                className="flex"
                                style={{
                                    width: '54px',
                                    marginTop: '10px',
                                    backgroundColor: borderBottomColor,
                                }}
                            />
                        </button>
                    )
                })}
            </div>
            <div className="InfoPageItemContent flex flex-col">
                <p className="flex text-white">{pageSelect?.content}</p>
            </div>
        </div>
    )
}

const BuyButton = ({ saleId, price }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    // console.log('Check walletInfo = ', walletInfo)

    useEffect(()=>{
        console.log('Check new walletInfo = ', walletInfo);
    }, [walletInfo])

    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    const _purchaseSale = async ({
        saleId,
        price, // some value like '10',
        marketCont,
        tokenCont,
    }) => {
        if (!saleId || saleId === -1) {
            return
        }
        console.log('Check run _purchaseSale')
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
            // purchaseToken will like that
            // accessList: null
            // blockHash: null
            // blockNumber: null
            // chainId: 0
            // confirmations: 0
            // creates: null
            // data: "0x095ea7b30000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000015af1d78b58c40000"
            // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
            // gasLimit: BigNumber {_hex: '0xb75a', _isBigNumber: true}
            // gasPrice: BigNumber {_hex: '0x4494f197', _isBigNumber: true}
            // hash: "0x399205fb4a186e6013dd2859f7568e8e9b1faa9f480a9b9abef1d111884752f9"
            // maxFeePerGas: BigNumber {_hex: '0x4494f197', _isBigNumber: true}
            // maxPriorityFeePerGas: BigNumber {_hex: '0x4494f197', _isBigNumber: true}
            // nonce: 14
            // r: "0x50c5f9461ef67ba75ece51c56fa205c2f8628203ba0099ada50412b3b760e1dd"
            // s: "0x4fa7ade5e39b0ed9d5eaaec4788dbea5beb5c04243f399d91de7c24994058c1d"
            // to: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
            // transactionIndex: null
            // type: 2
            // v: 0
            // value: BigNumber {_hex: '0x00', _isBigNumber: true}
            // wait: (confirmations) => {…}
            console.log({ purchaseToken })

        } catch (err) {
            console.log(err?.data?.message)
        }
    }

    const onClickBuy = async () => {

        toast.info('Processing')
        console.log({ walletInfo })
        // return
        const signerAddress = walletInfo?.signerAddress || await walletInfo?.signer?.getAddress()
        console.log({ signerAddress })
        const wei = await tokenCont?.balanceOf(signerAddress) // is an BigNumberish
        console.log({ wei }) // 
        // _hex: "0x019d971e4fe8401e74000000"
        // _isBigNumber: true

        // get balance of HOWL token
        const howlTokenBalanceWeiInt = parseInt(ethers.utils.formatEther(wei))
        console.log({ howlTokenBalanceWeiInt })  // 500000000
        
        console.log({ price }) // is BigNumber
        const priceInt = ethers.utils.formatEther(price)
        console.log({ priceInt })

        const priceInHwl = priceInt/howlTokenBalanceWeiInt
        console.log({ priceInHwl })
        _purchaseSale({
            saleId,
            price: priceInt,
            tokenCont: tokenCont,
            marketCont: marketCont,
        })
    }

    if (!price) return null

    console.log(price)
    const priceInHwl = ethers.utils.formatEther(price)
    console.log('Check priceInHwl = ' + priceInHwl)

    return (
        <div className="ActionButtonsContainer flex flex-row">
            <button
                onClick={onClickBuy}
                className="ActionButtonItem ButtonBuy flex justify-center items-center">
                <a className="ActionButtonsTitle flex text-xl text-semibold text-white">
                    {`Buy for ${priceInHwl} HWL`}
                </a>
            </button>
        </div>
    )
}

const ItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)

    const route = useRouter()
    useEffect(() => {
        console.log('Check new itemSelect = ' + JSON.stringify(itemSelect))
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
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    marginRight: '10px',
                                }}>
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

    const itemImageSrc = itemSelect?.image || ''

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
                        {'RedX Ninja H2R'}
                    </p>
                    <div className="flex flex-row text-white">
                        <p className="flex">{'From'}</p>
                        <p className="flex">{'4.5 HOWL'}</p>
                        <p className="flex">{' . '}</p>
                        <p className="flex">{'20 of 25 available'}</p>
                    </div>
                    <ItemRating numberStar={4} />
                    <CreatorView />
                    <InfoPages />
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
