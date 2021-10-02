import { useEffect } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import Image from 'next/image'

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

    const renderStars = ({ numberStar = 5 }) => {
        return(
            <div className="flex flex-row">
                {Array(numberStar).fill(0).map((item, index)=>{
                    return(
                        <div key={`renderStars${index}`} style={{ width: '50px', height: '50px', marginRight: '10px' }} >
                            <img style={{ width: '50px', height: '50px' }} src={icons.star} />
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderCreator = () => {
        return(
            <div className="flex flex-row items-center">
                <img alt="creator-avatar" className="CreatorAvatar flex" src={icons.instagram} />
                <div className="flex flex-col text-white ml-4">
                    <h6>
                        {'Creator'}
                    </h6>
                    <h6>
                        {'Manhnd'}
                    </h6>
                </div>
            </div>
        );
    };
    
    const itemImageSrc = itemSelect?.image || '';

    return (
        <div className="ItemSelectedContainer bg-hwl-gray-1 flex flex-1 flex-col">
            <div className="ItemSelected flex flex-row self-center" >
                <img
                    className="ItemImage flex"
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
                        <p className="flex">
                            {'20 of 25 available'}
                        </p>
                    </div>
                    {renderStars({ numberStar: 4 })}
                    {renderCreator()}
                </div>
            </div>
        </div>
    )
}

export default ItemDetails
