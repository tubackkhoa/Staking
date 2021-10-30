import { icons } from 'assets'
import PropTypes from 'prop-types'

const CreatorView = ({ avatar, name }) => {
  return (
      <div className="flex flex-row items-center mt-4">
          <img
              alt="creator-avatar"
              className="flex w-12 h-12"
              src={avatar}
          />
          <div className="flex flex-col text-white ml-4">
              <h6 className="flex text-sm">{'Creator'}</h6>
              <h6>{name}</h6>
          </div>
      </div>
  )
}

CreatorView.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
}

CreatorView.defaultProps = {
  avatar: icons.instagram,
  name: 'Creator',
}

export default CreatorView;