import classNames from 'classnames'
import { globalKeys } from 'config/globalKeys'
import { routes } from 'config/routes'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { useGlobal } from 'reactn'
import { checkNetworkAndRequest, getAvailableItemsInStore } from 'services'
import { NftStoreCard } from '../../components'

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

const StorePagerBar = ({ data = []}) => {
    const [page, setPage] = React.useState(data[0])
    if (!Array.isArray(data)) return null;

    return (
        <div className="flex flex-col sm:flex-row self-center justify-center mt-12 items-center sm:items-start">
            {data.map((item, index) => {
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

const Container = props => {
    const [items, setItems] = React.useState([])
    const [storeItemSelect, setStoreItem] = useGlobal(globalKeys.storeItemSelect)
    const [loading, setLoading] = React.useState(false)
    const route = useRouter()

    React.useEffect(() => {
        checkNetworkAndRequest()
        const storeItems = getAvailableItemsInStore()
        // console.log({ storeItems })
        setItems(storeItems)
    }, [])

    if (loading) {
        return (
            <div className="flex flex-1 bg-black justify-center items-center">
                <div className="flex items-center justify-center ">
                    <div className="w-40 h-40 border-t-4 border-b-4 border-green-900 rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (!Array.isArray(items) || (items.length === 0)) {
        return (
            <div className="flex flex-1 bg-hwl-gray-2 justify-center items-center">
                <p className="flex text-3xl sm:text-5xl text-white font-bold text-center leading-snug">
                    All bikes on Howl Store are sold out 🎉🎉🎉 <br /> See you next time!
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col items-center px-12">
            <div className="first-letter:bg-hwl-gray-1">
                {/* <StorePagerBar data={pages} /> */}
                <div className="flex flex-wrap flex-1 p-4 mt-6">
                    {Array.isArray(items) &&
                        items.map((item, index) => {
                            if (!item) return null
                            const { file, uri } = item
                            const {
                                attributes = [],
                                description = '',
                                image = '',
                                name = '',
                            } = file
                            const ID = attributes[0].value
                            const Vehicle = attributes[1].value
                            const MotorbikeTypes = attributes[2].value
                            const Name = attributes[3].value
                            const nftImageUri = attributes[4].value // PNG

                            const itemKey = `NftStoreCard-${ID}-${file.image}`
                            // const { URI, contractAddress, tokenId } = item

                            // console.log({ imageUri: nftImageUri, Name, MotorbikeTypes })
                            return (
                                <NftStoreCard
                                    key={itemKey}
                                    URI={file?.image}
                                    nftImageUri={file?.image}
                                    showPrice={false}
                                    contractAddress={''}
                                    tokenId={''}
                                    index={index}
                                    name={name}
                                    onClick={({ nft }) => {
                                        route.push(routes.storeItemDetails)
                                        setStoreItem({
                                            ...file,
                                            uri,
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
