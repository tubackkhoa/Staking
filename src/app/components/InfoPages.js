import PropTypes from 'prop-types'

const InfoPages = ({ description }) => {
  // console.log('Check description = ' + description)
  const borderBottomColor = 'white'
  return (
      <div className="InfoPagesContainer flex flex-col w-full items-center sm:items-start max-w-sm mt-4 px-6 sm:px-0">
          <div className="InfoPageItem flex flex-col font-semibold">
              <div className="text-lg text-white mt-4 sm:mt-0">
                  {'Details'}
              </div>
              <div
                  className="flex mt-2.5 w-14"
                  style={{
                      backgroundColor: borderBottomColor,
                  }}
              />
          </div>
          <div className="InfoPageItemContent flex flex-col">
              <p className="flex text-white break-all text-center sm:text-left">{description}</p>
          </div>
      </div>
  )
}

InfoPages.propTypes = {
  description: PropTypes.string,
}

InfoPages.defaultProps = {
  description: '',
}

export default InfoPages;