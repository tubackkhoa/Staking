import { useEffect, useState } from 'react'
import { useGlobal } from 'reactn'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import classNames from 'classnames'

import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { icons } from 'assets'
import { routes } from 'config/routes'
import { configs } from 'config/config'

import {
    ItemConfigs,
    Loading,
    NftImage,
    TitleTokenIdSeller,
    InfoPages,
    RatingView,
} from 'app/components'
import connectWallet from 'app/main-app/wallet'

import {
    marketAddress,
    nftAddress,
    storeAddress,
} from '../../../../deployed_address.json'
import MarketplaceAbi from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import StoreAbi from '../../../../artifacts/contracts/Store.sol/Store.json'

// gameItemContract.createGameItem()
// marketCont.buyGameItem(uri, itemId)
const BuyStoreItemButton = ({ onClickBuy, price, loading }) => {
    const hoverAnim = 'transition duration-300 ease-in-out 0'

    return (
        <div className="flex flex-row mt-8">
            <button
                onClick={onClickBuy}
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

const StoreItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.storeItemSelect)
    const [itemId, setItemId] = useGlobal(null)
    const [available, setAvailable] = useState(0)
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const route = useRouter()
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState('')
    const [storeContract, setStore] = useState()
    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    useEffect(() => {
        _connectWalletAndSaveGlobal()
        getContract()
    }, [])

    useEffect(() => {
        if (!itemSelect) {
            route.back()
            return
        }
        const itemIdFromJson = itemSelect?.attributes[0].value
        console.log({ itemIdFromJson })
        setItemId(itemIdFromJson)
    }, [itemSelect, route])

    const _connectWalletAndSaveGlobal = async () => {
        const wallet = await connectWallet()
        if (!wallet) {
            toast.error('Connect wallet failed!')
            return
        }
        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            storeContract,
        } = wallet

        const signerAddress = await signer?.getAddress()

        setStore(storeContract)

        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
            storeContract,
        })

        return {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
            signerAddress,
            storeContract,
        }
    }

    const _getItemPrice = async ({ storeContract }) => {
        if (!storeContract || typeof storeContract?.storePrice !== 'function' || itemId === null || itemId === undefined) {
            console.log('Check _getItemPrice failed storeContract = ' + JSON.stringify(storeContract))
            console.log({ storeContract })
            return
        }
        setLoading(true)
        const itemPrice = await storeContract?.storePrice(itemId) // BigNumber
        setLoading(false)
        if(!itemPrice) {
            console.log('Check invalid itemPrice!')
            return
        }
        const priceInHwl = ethers?.utils?.formatEther(itemPrice || '0') || 0
        setPrice(priceInHwl)
    }

    const _getItemAvailable = async ({ storeContract }) => {
        if (
            !storeContract ||
            typeof storeContract?.availableQuantity !== 'function'
            || itemId === null || itemId === undefined
        ) {
            console.log('Check _getItemAvailable failed!')
            console.log({ storeContract })
            return
        }
        setLoading(true)
        const available = await storeContract?.availableQuantity(itemId) // BigNumber
        setLoading(false)
        if(!available) {
            console.log('Check invalid itemPrice!')
            return
        }
        setAvailable(available?.toNumber())
    }

    const _onClickBuy = async () => {
        if (!tokenCont) {
            _connectWalletAndSaveGlobal()
            return
        }

        if(!price){
            _getItemPrice({ storeContract })
            return
        }

        if(available === 0) {
            toast.warn('This model is sold out, please try another model or wait for our next release!')
            return
        }

        try {
            console.log('Check ' + (await walletInfo?.signer?.getAddress()))
            const allowance = await tokenCont?.allowance(
                walletInfo?.signer?.getAddress(),
                storeContract.address
            )
            console.log({ allowance })
            const priceInt = parseInt(price)
            console.log({ priceInt })
            if (allowance.lt(ethers.BigNumber.from(`${priceInt}`))) {
                const approveAllowance = await tokenCont?.approve(
                    storeContract.address,
                    configs.unlimitedAllowance
                )
                await approveAllowance.wait()
                console.log({ approveAllowance })
            }

            const buyStoreItem = await storeContract?.buyGameItem(
                itemSelect?.uri,
                itemId
            )
            await buyStoreItem.wait() // waiting create transaction
            setLoading(false)
            console.log({ buyStoreItem })
            toast.success(`Buy bike successfully!`)
            setTimeout(() => {
                route.push(routes.myAssets)
            }, 2000)
        } catch (err) {
            console.log(err)
            setLoading(false)
            toast.dismiss()
            toast.error(`Buy bike failed with error ${err?.data?.message}!`)
            console.log(err?.data?.message)
        }
    }

    const getContract = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            configs.Networks.BscTestnet.RPCEndpoints
        )
        const storeContract = new ethers.Contract(
            storeAddress,
            StoreAbi?.abi,
            provider
        )
        setStore(storeContract)
        _getItemPrice({ storeContract })
        _getItemAvailable({ storeContract })
    }

    return (
        <div className="flex flex-1 flex-col pt-16">
            <div className="flex flex-col md:flex-row self-center">
                <div className="flex flex-col pb-24">
                    {/* <TitleTokenIdSeller/> */}
                    <NftImage imageUri={itemSelect?.image} />
                    <ItemConfigs />
                </div>
                <div className="flex flex-col justify-center items-center sm:items-start mt-16 md:ml-16 md:mt-0 pb-12 sm:pb-0">
                    <p className="flex text-white text-3xl font-semibold">
                        {itemSelect?.name}
                    </p>
                    <div className="flex flex-row text-white mt-2 sm:mt-0">
                        <p className="flex">{`${available} items available`}</p>
                    </div>
                    <RatingView numberStar={3} size={50} />
                    <InfoPages description={itemSelect?.description} />
                    <BuyStoreItemButton
                        onClickBuy={_onClickBuy}
                        price={price}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}

StoreItemDetails.propTypes = {}

StoreItemDetails.defaultProps = {}

export default StoreItemDetails
