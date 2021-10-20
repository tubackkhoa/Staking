import { useEffect, useState } from 'react'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'
import { ethers } from 'ethers'
import BigNumber from "bignumber.js";

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

const NftCard = ({ URI, contractAddress, tokenId, price = 0, index, onClick }) => {

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

    if(price === null || price === undefined) {
        console.log({ price })
        console.log(`Invalid price, can't show NFT card!`)
        return null
    }
    // console.log('Check price = ', price)
    const priceInHwl = ethers.utils.formatEther(price) || ''

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
            className="transition duration-500 ease-in-out hover:bg-blue-500 transform hover:-translate-y-1 hover:scale-105 flex flex-col items-center w-52 h-80 rounded-lg m-4 bg-Gray-1 overflow-hidden">
            <img
                alt="itemInfo-image"
                className="flex w-52 h-52"
                src={itemInfo?.image}
            />
            <div className="flex flex-1 flex-col items-left w-full Info p-3">
                <a className="text-white text-left Title">{itemInfo?.name}</a>
                <div
                    className="flex flex-row items-center w-full"
                    style={{ marginTop: '4px' }}>
                    <a className="flex text-white Price">{priceInHwl}</a>
                    <a className="flex text-white TokenCode">
                        {attributes?.tokenCode}
                    </a>
                    <img className="HeartIcon" src={icons.heart} />
                    <a
                        className="flex text-white"
                        style={{
                            marginLeft: '3px',
                            fontSize: '12px',
                        }}>
                        {attributes?.like}
                    </a>
                </div>
                <div
                    className="flex flex-row items-center justify-between"
                    style={{ marginTop: '8px' }}>
                    <ItemRating numberStar={attributes?.star} />
                    <div
                        className="flex justify-center items-center"
                        style={{
                            padding: '4px 6px 4px 6px',
                            backgroundColor: colors.yellowBinance,
                            borderRadius: '4px',
                        }}>
                        <a
                            className="flex"
                            style={{
                                fontSize: '11px',
                                color: colors.black1,
                            }}>
                            {'BSC'}
                        </a>
                    </div>
                </div>
            </div>
        </button>
    )
}

export default NftCard
