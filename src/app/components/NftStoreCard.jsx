import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'
import { ethers } from 'ethers'
import classNames from 'classnames'
import Image from 'next/image'
import { isURL } from 'utils'
import RatingView from './RatingView'

const NftStoreCard = ({
    URI,
    contractAddress,
    tokenId,
    price = 0,
    onClick,
    showPrice = true,
    nftImageUri = '',
    name,
}) => {
    const [attributes, setAttributes] = useState({
        id: '',
        title: '',
        image: '',
        tokenCode: 'DNFT',
        star: 3,
    })

    // console.log({ name })

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
    const priceInDfnt = ethers?.utils?.formatEther(price) || ''

    const renderPrice = () => {
        if (!showPrice) return null
        return (
            <div className="flex flex-row items-center w-full mt-1">
                <div className="flex text-white Price">{priceInDfnt}</div>
                <div className="flex text-white mx-2 TokenCode">
                    {attributes?.tokenCode}
                </div>
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
                <div className="text-white text-left text-base">{name}</div>
                {renderPrice()}
                <div className="flex flex-row items-center justify-between mt-2">
                    <RatingView numberStar={attributes?.star} />
                    <div className="flex justify-center items-center py-1 px-2 rounded-md bg-Yellow-1">
                        <div className="flex text-xs text-hwl-gray-1">
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
    price: PropTypes.any,
    onClick: PropTypes.func,
    showPrice: PropTypes.bool,
    nftImageUri: PropTypes.string,
    name: PropTypes.string,
}

NftStoreCard.defaultProps = {
    URI: '',
    contractAddress: '',
    tokenId: '',
    price: 0,
    onClick: () => undefined,
    showPrice: true,
    nftImageUri: '',
    name: 'DareNFTcity motorbike xxx',
}

export default NftStoreCard
