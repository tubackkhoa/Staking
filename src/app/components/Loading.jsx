import React from 'react'
import classNames from "classnames"
import PropTypes from 'prop-types'

const Loading = ({ className = '', spinStyle, size }) => {
  return(
    <div className={classNames("flex justify-center items-center", className)}>
      <div className={classNames(`animate-spin rounded-full h-${size} w-${size} border-b-2 border-white`, spinStyle)}></div>
    </div>
  )
}

Loading.propTypes = {
  className: PropTypes.string,
  spinStyle: PropTypes.string,
  size: PropTypes.number,
}

Loading.defaultProps = {
  className: '',
  spinStyle: '',
  size: 4,
}

export default Loading