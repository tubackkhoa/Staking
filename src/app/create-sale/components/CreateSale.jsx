import { useEffect, useState } from 'react'
import { globalKeys } from 'config/globalKeys'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import connectWallet from 'app/main-app/wallet'
import { routes } from 'config/routes'
import { Loading } from 'app/components'
import classNames from 'classnames'

const ItemRating = ({ numberStar = 5 }) => {
    return (
        <div className="flex flex-row mt-4 sm:mt-4">
            {Array(numberStar)
                .fill(0)
                .map((item, index) => {
                    return (
                        <div
                            key={`renderStars${index}`}
                            className="flex w-12 h12 mr-3">
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
                <h6>{'Manhnd'}</h6>
            </div>
        </div>
    )
}

const InfoPages = ({ description }) => {
    // console.log('Check description = ' + description)
    const borderBottomColor = 'white'
    return (
        <div className="InfoPagesContainer flex flex-col w-full max-w-sm">
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
    let isApproved = false

    const { howlTokenContract: tokenCont, marketplaceContract: marketCont } =
        walletInfo

    useEffect(()=>{
        _checkConnectWallet()
    }, [])

    const _checkConnectWallet = async () => {
        console.log('_checkConnectWallet')
        if (!walletInfo || !walletInfo.signer) {
            toast.info('Connecting to your metamask!')
            await _connectWalletAndSaveGlobal({
                onSuccess: async () => {
                    // await _approveAndCreateSale()
                },
                onError: () => {
                    toast.error(
                        'Connect wallet failed, please check your metamask wallet connect the BSC network!'
                    )
                },
            })
            return
        }
    }

    const _connectWalletAndSaveGlobal = async ({
        onSuccess = () => {},
        onError = () => {},
    }) => {
        const wallet = await connectWallet()
        if (!wallet) {
            onError()
            return
        }
        onSuccess()

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
        if (loading) {
            toast.warning('Please waiting ...')
            return
        }
        console.log({ walletInfo })
        if (!walletInfo || !walletInfo.signer) {
            toast.info('Connecting to your metamask!')
            await _connectWalletAndSaveGlobal({
                onSuccess: async () => {
                    // await _approveAndCreateSale()
                },
                onError: () => {
                    toast.error(
                        'Connect wallet failed, please check your metamask wallet connect the BSC network!'
                    )
                },
            })
            return
        }
        await _approveAndCreateSale()
    }

    const _approveAndCreateSale = async () => {
        const signerAddress =
            walletInfo?.signerAddress ||
            (await walletInfo?.signer?.getAddress())

        const reqApprove = await _approveAddress({
            signerAddress,
            marketCont,
            gameItemContract: walletInfo?.gameItemContract,
        })

        await _createSaleOnChain(
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
        if (!isApproved) {
            const approval = await gameItemContract?.approveAddress(
                marketCont?.address
            )
            await approval.wait()
            isApproved = true
        }
        return isApproved
    }

    const _createSaleOnChain = async (
        tokenId,
        price,
        signerAddress,
        marketCont,
        gameItemContract
    ) => {
        setLoading(true)
        const ownerOfTokenAddress = await gameItemContract?.ownerOf(tokenId)
        // check if the seller is the owner of this token
        // if true then the seller can sell
        // else return error
        if (ownerOfTokenAddress === signerAddress) {
            try {
                const createdSale = await marketCont?.createSale(
                    tokenId,
                    ethers.utils.parseEther(price)
                )
                await createdSale.wait()  // waiting create transaction
                toast.success('Create sale successfully!')
                console.log({ createdSale })
                setLoading(false)
                setTimeout(() => {
                    route.push(routes.mainApp)
                }, 1000)
            } catch (err) {
                setLoading(false)
                const errorMsg = err?.data?.message
                    ? ` ${err?.data?.message}`
                    : ''
                toast.error(`Create sale failed!` + errorMsg)
                console.log(err)
            }
        } else {
            toast.warning(
                `Not owner of tokenId \n Your address is ${signerAddress} \n Owner of token address is ${ownerOfTokenAddress}`
            )
            console.log(`Not owner of tokenId ${signerAddress}`)
        }
    }

    const hoverAnim = "transition duration-300 ease-in-out hover:bg-blue-500"

    return (
        <button
            onClick={_onClickCreateSale}
            className={classNames(
                "flex h-12 max-w-7xl border-Blue-1 border-2 flex-row justify-center items-center rounded-lg mt-6",
                hoverAnim,
            )}>
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
        // console.log(
        //     'Check new myAssetSelect = ' + JSON.stringify(myAssetSelect)
        // )
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
        <div className="ItemSelectedContainer flex flex-1 flex-col">
            <div className="flex flex-col sm:flex-row self-center">
                <div className="flex w-72 h-72 sm:w-96 sm:h-96 transition-all" >
                    <img
                        className="flex flex-1 rounded-3xl"
                        src={myAssetSelect?.image}
                        alt="main-item-image"
                    />
                </div>
                {/* <Image src={itemImageSrc} alt="Picture of the author" className="ItemImage flex" /> */}
                <div className="flex flex-col ml-0 sm:ml-16">
                    <div className="flex text-white mt-12 text-3xl font-semibold sm:mt-0">
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
