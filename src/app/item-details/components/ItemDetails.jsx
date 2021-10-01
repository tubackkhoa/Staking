import { useEffect } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'

const ItemDetails = () => {
    const [itemSelect, setItemSelect] = useGlobal(globalKeys.itemSelect)
    useEffect(() => {
        console.log('Check new itemSelect = ', itemSelect)
        const { id, image, like, price, star, title, tokenCode } = itemSelect
    }, [itemSelect])

    // const renderStars = ({ numberStar = 5 }) => {
    //     return(
    //         <div className="flex flex-row">
    //             {Array.from(numberStar)}
    //         </div>
    //     )
    // }

    return (
        <div className="ItemSelected bg-hwl-gray-1 flex flex-row">
            <img
                className="ItemImage flex"
                src={itemSelect?.image}
                alt="main-item-image"
            />
            <div className="ItemInfoBlock flex flex-col">
                <p className="ItemName flex text-white">{'RedX Ninja H2R'}</p>
                <div className="flex flex-row">
                    <p className="flex text-white">{'From'}</p>
                    <p className="flex text-white">{'4.5 HOWL'}</p>
                    <p className="flex text-white">{' . '}</p>
                    <p className="flex text-white">{'20 of 25 available'}</p>
                </div>
            </div>
        </div>
    )
}

export default ItemDetails
