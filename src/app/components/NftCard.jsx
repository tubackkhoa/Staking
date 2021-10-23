import { useEffect, useState } from 'react'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import Image from 'next/image'

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
                // handle success
                // console.log({ response })
                if (response.status !== 200) {
                    console.log(`Get NFT's info fail!`)
                    return
                }
                const { attributes, description, image, name } = response.data
                setItemInfo({ description, image, name })
            })
            .catch(function (error) {
                // handle error
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
                <img className="HeartIcon flex ml-auto" src={icons.heart} />
                <div className="flex text-white ml-1 text-xs">
                    {attributes?.like}
                </div>
            </div>
        )
    }

    const hoverAnim =
        'transition duration-500 ease-in-out hover:bg-blue-700 transform hover:-translate-y-1 hover:scale-105'

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
                'flex-col rounded-lg m-4 bg-Gray-1 overflow-hidden w-52',
                hoverAnim
            )}>
                {itemInfo?.image && <img
                alt="itemInfo-image"
                className="w-52 h-52"
                src={itemInfo?.image}
            />}
            <div className="flex flex-col items-left w-full Info px-3 py-4">
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

export default NftCard
