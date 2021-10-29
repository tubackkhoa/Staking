import classNames from 'classnames'
import { globalKeys } from 'config/globalKeys'
import { routes } from 'config/routes'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { useGlobal } from 'reactn'
import { NftStoreCard } from '../../components'

// tren store chi ban xe tu 11 - 15

// https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC

const pinataFolderUri = 'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC'
const uriList = [
    'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/11.json',
    'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/12.json',
    'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/13.json',
    'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/14.json',
    'https://gateway.pinata.cloud/ipfs/QmNzAnq2DMoRsf8CPJWwPcDxv95wmSzvGixkvhgwpxPQVC/15.json',
]
import json11 from './../../../data/storeData/11.json'
import json12 from './../../../data/storeData/12.json'
import json13 from './../../../data/storeData/13.json'
import json14 from './../../../data/storeData/14.json'
import json15 from './../../../data/storeData/15.json'

const getAvailableItemsInStore = () => {
    const jsonFiles = [json11, json12, json13, json14, json15]
    return jsonFiles
}

const pages = [
    {
        id: 0,
        title: '3 stars bikes',
        type: '3star',
    },
    {
        id: 1,
        title: '4 stars bikes',
        type: '3star',
    },
    {
        id: 2,
        title: '5 stars bikes',
        type: '3star',
    },
]

const Container = props => {
    const [items, setItems] = React.useState([])
    const [page, setPage] = React.useState(pages[0])
    const [storeItemSelect, setStoreItem] = useGlobal(globalKeys.storeItemSelect)
    const route = useRouter()

    React.useEffect(() => {
        const storeItems = getAvailableItemsInStore()
        console.log({ storeItems })
        setItems(storeItems)
    }, [])

    const renderComingSoon = () => {
        return (
            <h1 className="flex text-white font-bold text-4xl text-center">
                HOWL Store coming soon!
            </h1>
        )
    }

    const renderPagerBar = () => {
        
        return (
            <div className="flex flex-col sm:flex-row self-center justify-center mt-12 items-center sm:items-start">
                {pages.map((item, index) => {
                    const isCurrentPage = page.id === item.id
                    const onClick = () => {
                        setPage(item)
                    }
                    const selectStyle = isCurrentPage ? "bg-Blue-1" : ""
                    return (
                        <button
                            onClick={onClick}
                            key={`pages-${item.title}-${item.type}`}
                            className={classNames("flex w-52 h-12 sm:h-10 justify-center items-center my-3 sm:my-0 mx-0 sm:mx-3 rounded-lg border border-Blue-1", selectStyle)}>
                            <div className="flex text-white text-xl font-medium">
                                {item?.title}
                            </div>
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col items-center px-12">
            <div className="first-letter:bg-hwl-gray-1">
                {renderPagerBar()}
                <div className="flex flex-wrap flex-1 p-4 mt-6">
                    {Array.isArray(items) &&
                        items.map((item, index) => {
                            if (!item) return null
                            const {
                                attributes = [],
                                description = '',
                                image = '',
                                name = '',
                            } = item
                            const ID = attributes[0].value
                            const Vehicle = attributes[1].value
                            const MotorbikeTypes = attributes[2].value
                            const Name = attributes[3].value
                            const nftImageUri = attributes[4].value // PNG

                            const itemKey = `NftStoreCard-${ID}-${nftImageUri}`
                            // const { URI, contractAddress, tokenId } = item

                            // console.log({ imageUri: nftImageUri, Name, MotorbikeTypes })
                            return (
                                <NftStoreCard
                                    key={itemKey}
                                    URI={nftImageUri}
                                    nftImageUri={nftImageUri}
                                    showPrice={false}
                                    contractAddress={''}
                                    tokenId={''}
                                    index={index}
                                    onClick={({ nft }) => {
                                        route.push(routes.storeItemDetails)
                                        setStoreItem({
                                            ...item,
                                            saleId: 'saleId',
                                            buyer: 'buyer',
                                            isActive: 'isActive',
                                            isSold: 'isSold',
                                            price: 'price',
                                            seller: 'seller',
                                        })
                                    }}
                                />
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default Container
