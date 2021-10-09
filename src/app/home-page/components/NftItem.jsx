import { useEffect, useState } from 'react'
import { icons } from 'assets'
import { colors } from 'config/colors'
import axios from 'axios'

const ItemRating = ({ numberStar = 0 }) => {
    return (
        <div className="flex flex-row">
            {Array(numberStar)
                .fill(0)
                .map((item, index) => {
                    return (
                        <div key={`ItemRating-${index}`}>
                            <img
                                className="flex"
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    marginRight: '6px',
                                }}
                                src={icons.star}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

const NftItem = ({ item, index, onClick }) => {
    const { URI, contractAddress } = item

    const [attributes, setAttributes] = useState({
        id: '',
        title: '',
        image: '',
        like: 99,
        price: 0,
        tokenCode: 'HWL',
        star: 5,
    })

    const [itemInfo, setItemInfo] = useState({
        description: '',
        image: '',
        name: '',
    })

    useEffect(() => {
        console.log('Check tokenId toString = ', item.tokenId.toString())
        axios
            .get(URI)
            .then(function (response) {
                // handle success
                console.log({ response })
                if (response.status !== 200) {
                    console.log('Get nft info fail!')
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
    }, [item])

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
            className="flex flex-col NftItem">
            <img
                className="flex"
                style={{
                    width: '182px',
                    height: '182px',
                    borderRadius: '20px',
                }}
                src={itemInfo?.image}
            />
            <div className="flex flex-1 flex-col items-left w-full Info">
                <a className="text-white text-left Title">{itemInfo?.name}</a>
                <div
                    className="flex flex-row items-center w-full"
                    style={{ marginTop: '4px' }}>
                    <a className="flex text-white Price">{attributes?.price}</a>
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

export { NftItem }
