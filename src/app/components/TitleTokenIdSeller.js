import React from "react"
import Proptypes from 'prop-types'

const TitleTokenIdSeller = ({ name, tokenId, sellerAddress }) => {
    return (
        <div className="flex flex-col px-4">
            <div className="flex text-2xl text-white font-semibold uppercase break-all">
                {name}
            </div>
            <div className="flex text-base text-white font-normal break-all">
                {`TokenId: ${tokenId}`}
            </div>
            <div className="flex text-base text-white font-normal break-all">
                {`Seller: ${sellerAddress}`}
            </div>
        </div>
    )
}

TitleTokenIdSeller.propTypes = {
    name: Proptypes.string,
    tokenId: Proptypes.string,
    sellerAddress: Proptypes.string,
}

TitleTokenIdSeller.defaultProps = {
    name: '#sportbike001',
    tokenId: '001',
    sellerAddress: '0x9d6835a231473Ee95cF95742b236C1EA40814460'
}

export default TitleTokenIdSeller;