/* eslint-disable @next/next/no-img-element */
import React from "react"
import PropTypes from 'prop-types'
import classNames from "classnames"

const NftImage = ({ imageUri, style, size }) => {
  const sizeSm = size * (72 / 64)
  const sizeMd = size * (96 / 64)
  return (
    <div className={classNames(`flex w-${size} h-${size} sm:w-${sizeSm} sm:h-${sizeSm} md:w-${sizeMd} md:h-${sizeMd} rounded-3xl transition-all mt-12 relative self-center`, style)}>
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
  imageUri: PropTypes.string,
  style: PropTypes.string,
  size: PropTypes.number,
}

NftImage.defaultProps = {
  imageUri: '',
  style: '',
  size: 64,
}

export default NftImage;