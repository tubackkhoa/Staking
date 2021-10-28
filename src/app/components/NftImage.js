import React from "react"
import Proptypes from 'prop-types'

const NftImage = ({ imageUri }) => {
  return (
    <div className="flex w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-3xl transition-all mt-12 relative self-center">
    <img
        className="flex flex-1 rounded-3xl"
        src={imageUri}
        alt="main-item-image"
    />
    <div
        className="flex h-10 w-64 sm:w-72 md:w-96 absolute self-center bottom-0"
        style={{
            background:
                'radial-gradient(50% 50% at 50% 50%, #20A4AD 0%, rgba(32, 164, 173, 0) 100%)',
        }}
    />
</div>
  )
}

NftImage.propTypes = {
  imageUri: Proptypes.string,
}

NftImage.defaultProps = {
  imageUri: '',
}

export default NftImage;