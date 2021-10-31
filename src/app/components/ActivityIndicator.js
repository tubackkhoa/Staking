import PropTypes from 'prop-types'

const ActivityIndicator = ({ size, color }) => {
  return (
    <div className="flex flex-1 bg-black justify-center items-center">
      <div className="flex items-center justify-center ">
        <div className={`w-${size} h-${size} border-t-4 border-b-4 border-${color} rounded-full animate-spin`}></div>
      </div>
    </div>
  )
}

ActivityIndicator.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
}

ActivityIndicator.defaultProps = {
  size: 40,
  color: 'green-900',
}

export default ActivityIndicator;