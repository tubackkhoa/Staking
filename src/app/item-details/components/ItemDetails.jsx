import { useEffect, useState } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import { dummyInfoPages } from './dummy'

const InfoPages = () => {
    const [pages, setPages] = useState([])
    const [pageSelect, setPageSelect] = useState(null)
    useEffect(() => {
        setPages(dummyInfoPages)
        setPageSelect(dummyInfoPages[0])
    }, [])

    return (
        <div className="InfoPagesContainer flex flex-col w-full">
            <div className="InfoPageHeader flex flex-row text-white w-full">
                {pages.map((item, index) => {
                    const { id, title, content } = item
                    const isSelect = pageSelect?.id === id
                    const borderBottomColor = isSelect ? 'white' : 'transparent'
                    const titleWeight = isSelect ? 600 : 400
                    const onClick = () => {
                        setPageSelect(item)
                    }
                    return (
                        <button
                            onClick={onClick}
                            key={`InfoPages-${id}`}
                            className="InfoPageItem flex flex-col"
                            style={{ fontWeight: titleWeight }}>
                            <a>{title}</a>
                            <div
                                className="flex"
                                style={{
                                    width: '54px',
                                    marginTop: '10px',
                                    backgroundColor: borderBottomColor,
                                }}
                            />
                        </button>
                    )
                })}
            </div>
            <div className="InfoPageItemContent flex flex-col">
                <p className="flex text-white">{pageSelect?.content}</p>
            </div>
        </div>
    )
}

const ActionButtons = () => {
    const onClickBuy = () => {}
    const onClickMakeOffer = () => {}
    return (
        <div className="ActionButtonsContainer flex flex-row">
            <button
                onClick={onClickBuy}
                className="ActionButtonItem ButtonBuy flex justify-center items-center">
                <a className="ActionButtonsTitle flex text-xl text-semibold text-white">
                    {'Buy for 4.5 ETH'}
                </a>
            </button>
            <button
                onClick={onClickMakeOffer}
                className="ActionButtonItem MakeOffer flex justify-center items-center">
                <a className="ActionButtonsTitle flex text-xl text-semibold text-white">
                    {'Make Offer'}
                </a>
            </button>
        </div>
    )
}

const ItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    const route = useRouter()
    useEffect(() => {
        console.log('Check new itemSelect = ', itemSelect)
        if (!itemSelect) {
            route.back()
            return
        }
        const { id, image, like, price, star, title, tokenCode } = itemSelect
    }, [itemSelect])

    const ItemRating = ({ numberStar = 5 }) => {
        return (
            <div className="flex flex-row">
                {Array(numberStar)
                    .fill(0)
                    .map((item, index) => {
                        return (
                            <div
                                key={`renderStars${index}`}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    marginRight: '10px',
                                }}>
                                <img
                                    style={{ width: '50px', height: '50px' }}
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

    const itemImageSrc = itemSelect?.image || ''

    return (
        <div className="ItemSelectedContainer flex flex-1 flex-col pt-16">
            <div className="ItemSelected flex flex-row self-center">
                <img
                    className="flex w-96 h-96 rounded-3xl"
                    src={itemSelect?.image}
                    alt="main-item-image"
                />
                {/* <Image src={itemImageSrc} alt="Picture of the author" className="ItemImage flex" /> */}
                <div className="ItemInfoBlock flex flex-col">
                    <p className="ItemName flex text-white">
                        {'RedX Ninja H2R'}
                    </p>
                    <div className="flex flex-row text-white">
                        <p className="flex">{'From'}</p>
                        <p className="flex">{'4.5 HOWL'}</p>
                        <p className="flex">{' . '}</p>
                        <p className="flex">{'20 of 25 available'}</p>
                    </div>
                    <ItemRating numberStar={4} />
                    <CreatorView />
                    <InfoPages />
                    <ActionButtons />
                </div>
            </div>
        </div>
    )
}

export default ItemDetails
