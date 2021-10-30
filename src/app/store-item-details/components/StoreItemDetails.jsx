import { useEffect, useState } from 'react'
import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import connectWallet from 'app/main-app/wallet'
import { routes } from 'config/routes'
import { ItemConfigs, Loading, NftImage, TitleTokenIdSeller, InfoPages, RatingView } from 'app/components'
import classNames from 'classnames'
import { configs } from 'config/config'

// gameItemContract.createGameItem()
// marketCont.buyGameItem(uri, itemId)
const BuyStoreItemButton = ({ uri = '', itemId = '' }) => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState('')
    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } = walletInfo

        // .availableQuantity(itemId)

    useEffect(() => {
        _connectWalletAndSaveGlobal()
    }, [])

    // marketCont.storePrice()
    const _getItemPrice = async ({ marketCont }) => {
        if(!marketCont || typeof marketCont?.storePrice !== 'function'){
            console.log('Check _getItemPrice failed!')
            console.log({ marketCont })
            return
        }
        const itemPrice = await marketCont?.storePrice(); // BigNumber
        const priceInHwl = ethers?.utils?.formatEther(itemPrice) || 0
        setPrice(priceInHwl)
    }

    // use function buyGameItem(string memory uri, uint256 itemId) 
    const _onClickBuy = async () => {
        const marketCont = walletInfo?.marketplaceContract
        await marketCont?.buyGameItem()
    }

    const _connectWalletAndSaveGlobal = async () => {
        const wallet = await connectWallet()
        // toast.dismiss()
        // toast.success('Connect wallet successfully!')
        console.log('check wallet = ', { wallet })

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

        await _getItemPrice({ marketCont: marketplaceContract })

        return {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
        }
    }

    // console.log(price)

    // .availableQuantity(itemId)
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
                    {`Buy for ${price} HWL`}
                </div>
                {!!loading && <Loading className="ml-4" />}
            </button>
        </div>
    )
}

const ItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.storeItemSelect)
    const [itemId, setItemId] = useGlobal(null)

    const route = useRouter()
    useEffect(() => {
        console.log('Check new itemSelect = ' + JSON.stringify(itemSelect))
        if (!itemSelect) {
            route.back()
            return
        }
        const itemIdFromJson = itemSelect?.attributes[0].value
        setItemId(itemIdFromJson)
    }, [itemSelect, route])

    return (
        <div className="flex flex-1 flex-col pt-16">
            <div className="flex flex-col md:flex-row self-center">
                <div className="flex flex-col pb-24">
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
                    <RatingView numberStar={4} size={50} />
                    <InfoPages description={itemSelect?.description} />
                    <BuyStoreItemButton
                        uri={''}
                        itemId={itemId}
                    />
                </div>
            </div>
        </div>
    )
}

export default ItemDetails
