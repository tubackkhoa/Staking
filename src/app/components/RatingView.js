/* eslint-disable @next/next/no-img-element */
import { icons } from 'assets'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const RatingView = ({ numberStar, size, className, starClass }) => {
  return (
    <div className={classNames("flex flex-row mt-4", className)}>
      {Array(numberStar)
        .fill(0)
        .map((item, index) => {
          return (
            <div
              key={`renderStars${index}`}
              style={{ width: `${size}px`, height: `${size}px` }}
              className={classNames("flex w-12 h-12 mr-2.5", starClass)}>
              <img
                alt="star-image"
                className="flex flex-1"
                src={icons.star}
              />
            </div>
          )
        })}
    </div>
  )
}

RatingView.propTypes = {
  numberStar: PropTypes.number,
  size: PropTypes.number,
  className: PropTypes.string,
  starClass: PropTypes.string,
}

RatingView.defaultProps = {
  numberStar: 5,
  size: 20,
  className: '',
  starClass: '',
}

export default RatingView;