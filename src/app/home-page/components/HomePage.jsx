import { icons } from 'assets'
import QuickFilterBar from './QuickFilterBar'
import { nfts } from '../statics/dummy'
import { useRouter } from 'next/dist/client/router'
import React, { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'
import { colors } from 'config/colors'

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

const HomePage = () => {
    const route = useRouter()
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)

    const onClickNft = ({ nft }) => {
        route.push('./item-details')
        setItemSelect(nft)
    }
    return (
        <div className="first-letter:bg-hwl-gray-1 HomePage">
            <QuickFilterBar />
            <div className="NftItems flex flex-wrap">
                {nfts.map(item => {
                    const { id, title, image, like, price, tokenCode, star } =
                        item
                    return (
                        <button
                            key={id}
                            onClick={() => onClickNft({ nft: item })}
                            className="flex flex-col NftItem">
                            <img
                                className="flex"
                                style={{
                                    width: '182px',
                                    height: '182px',
                                    borderRadius: '20px',
                                }}
                                src={image}
                            />
                            <div className="flex flex-1 flex-col items-left w-full Info">
                                <a className="text-white text-left Title">
                                    {title}
                                </a>
                                <div
                                    className="flex flex-row items-center w-full"
                                    style={{ marginTop: '4px' }}>
                                    <a className="flex text-white Price">
                                        {price}
                                    </a>
                                    <a className="flex text-white TokenCode">
                                        {tokenCode}
                                    </a>
                                    <img
                                        className="HeartIcon"
                                        src={icons.heart}
                                    />
                                    <a
                                        className="flex text-white"
                                        style={{
                                            marginLeft: '3px',
                                            fontSize: '12px',
                                        }}>
                                        {like}
                                    </a>
                                </div>
                                <div
                                    className="flex flex-row items-center justify-between"
                                    style={{ marginTop: '8px' }}>
                                    <ItemRating numberStar={star} />
                                    <div
                                        className="flex justify-center items-center"
                                        style={{
                                            padding: '4px 6px 4px 6px',
                                            backgroundColor: colors.yellowBinance,
                                            borderRadius: '4px',
                                        }}>
                                            <a className="flex" style={{ fontSize: '11px', color: colors.black1 }} >
                                                {'BSC'}
                                            </a>
                                        </div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default HomePage
