import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'
import { ethers } from 'ethers'
import classNames from 'classnames'
import Image from 'next/image'
import { RatingView } from '.'

const NftCard = ({
    URI,
    contractAddress,
    tokenId,
    price = 0,
    index,
    onClick,
    showPrice = true,
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
        image: '',
        name: '',
    })

    useEffect(() => {
        axios
            .get(URI)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log(`Get NFT's info fail!`)
                    return
                }
                const { attributes, description, image, name } = response.data
                setItemInfo({ description, image, name })
            })
            .catch(function (error) {
                console.log(error)
            })
            .then(function () {
                // always executed
            })
    }, [URI, contractAddress, tokenId])

    if (price === null || price === undefined) {
        console.log({ price })
        console.log(`Invalid price, can't show NFT card!`)
        return null
    }
    // console.log('Check price = ', price)
    const priceInHwl = ethers.utils.formatEther(price) || ''

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
    const hoverAnim =
        'duration-500 transform hover:-translate-y-2'

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
                        alt="itemInfo-image"
                        className="w-52 h-52"
                        src={itemInfo?.image}
                    />
                )}
            </div>
            <div className="flex flex-col items-left w-full mt-2 px-3 py-4">
                <div className="text-white text-left text-base">
                    {itemInfo?.name}
                </div>
                {renderPrice()}
                <div className="flex flex-row items-center justify-between mt-2">
                    <RatingView numberStar={attributes?.star} />
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

NftCard.propTypes = {
    URI: PropTypes.string,
    contractAddress: PropTypes.string,
    tokenId: PropTypes.string,
    price: PropTypes.number,
    index: PropTypes.number,
    onClick: PropTypes.func,
    showPrice: PropTypes.bool,
}

NftCard.defaultProps = {
    URI: '',
    contractAddress: '',
    tokenId: '',
    price: 0,
    index: 0,
    onClick: () => undefined,
    showPrice: true,
}

export default NftCard
