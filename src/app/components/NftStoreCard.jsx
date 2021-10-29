import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import Image from 'next/image'
import { isURL } from 'utils'

const ItemRating = ({ numberStar = 0 }) => {
    return (
        <div className="flex flex-row">
            {Array(numberStar)
                .fill(0)
                .map((item, index) => {
                    return (
                        <div key={`ItemRating-${index}`}>
                            <img
                                alt="star-image"
                                className="flex mr-2 w-5 h-5"
                                src={icons.star}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

const NftStoreCard = ({
    URI,
    contractAddress,
    tokenId,
    price = 0,
    onClick,
    showPrice = true,
    nftImageUri = '',
}) => {
    const [attributes, setAttributes] = useState({
        id: '',
        title: '',
        image: '',
        like: 99,
        tokenCode: 'HWL',
        star: 5,
    })

    const [itemInfo, setItemInfo] = useState({
        description: '',
        image: nftImageUri,
        name: '',
    })

    if (price === null || price === undefined) {
        console.log({ price })
        console.log(`Invalid price, can't show NFT card!`)
        return null
    }
    // console.log('Check price = ', price)
    const priceInHwl = ethers?.utils?.formatEther(price) || ''

    const renderPrice = () => {
        if (!showPrice) return null
        return (
            <div className="flex flex-row items-center w-full mt-1">
                <div className="flex text-white Price">{priceInHwl}</div>
                <div className="flex text-white mx-2 TokenCode">
                    {attributes?.tokenCode}
                </div>
                {/* <img className="HeartIcon flex ml-auto" src={icons.heart} /> */}
                {/* <div className="flex text-white ml-1 text-xs">
                    {attributes?.like}
                </div> */}
            </div>
        )
    }

    const hoverBg = 'hover:bg-Blue-1'
    const hoverTransition = 'transition ease-in-out'
    const hoverScale = 'hover:scale-105'
    const hoverAnim = 'duration-500 transform hover:-translate-y-2'

    return (
        <button
            onClick={() =>
                onClick({
                    nft: {
                        URI,
                        contractAddress,
                        ...itemInfo,
                        attributes,
                    },
                })
            }
            className={classNames(
                'flex-col rounded-lg m-4 bg-Gray-1 overflow-hidden w-52 group',
                hoverAnim
            )}>
            <div className="w-52 h-52 bg-Gray-1">
                {itemInfo?.image && (
                    <img
                        className="w-52 h-52"
                        alt="itemInfo-image"
                        src={itemInfo?.image}
                    />
                    // <Image
                    //     alt="itemInfo-image"
                    //     src={itemInfo?.image}
                    //     layout="fill"
                    //     width={200}
                    //     height={200}
                    // />
                )}
            </div>
            <div className="flex flex-col items-left w-full mt-2 px-3 py-4">
                <div className="text-white text-left text-base">
                    {itemInfo?.name}
                </div>
                {renderPrice()}
                <div className="flex flex-row items-center justify-between mt-2">
                    <ItemRating numberStar={attributes?.star} />
                    <div
                        className="flex justify-center items-center py-1 px-2 rounded-md"
                        style={{ backgroundColor: colors.yellowBinance }}>
                        <div
                            className="flex"
                            style={{ fontSize: '11px', color: colors.black1 }}>
                            {'BSC'}
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}

NftStoreCard.propTypes = {
    URI: PropTypes.string,
    contractAddress: PropTypes.string,
    tokenId: PropTypes.string,
    price: PropTypes.number,
    onClick: PropTypes.func,
    showPrice: PropTypes.bool,
    nftImageUri: PropTypes.string,
}

NftStoreCard.defaultProps = {
    URI: '',
    contractAddress: '',
    tokenId: '',
    price: 0,
    onClick: () => undefined,
    showPrice: true,
    nftImageUri: '',
}

export default NftStoreCard
