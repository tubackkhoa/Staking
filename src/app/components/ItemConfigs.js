import React from "react"
import Proptypes from 'prop-types'

const defaultConfigs = [
  {
      id: 0,
      title: 'Max speed',
      value: 70,
      max: 100,
  },
  {
      id: 1,
      title: 'Acceleration',
      value: 7,
      max: 12,
  },
  {
      id: 2,
      title: 'Steering',
      value: 70,
      max: 100,
  },
  {
      id: 3,
      title: 'Boost speed',
      value: 70,
      max: 100,
  },
]


const ItemConfigs = ({ title, configs }) => {
  return (
      <div className="flex flex-col items-center">
          <div className="flex text-white font-bold text-2xl text-center mt-12">
              {title}
          </div>
          <div className="flex flex-wrap px-12 mt-6">
              {configs.map(item => {
                  const percent = (item?.value / item?.max) * 100
                  const percentLength = `${parseInt(percent)}%`
                  return (
                      <div
                          key={`config-${item?.title}-${item?.id}`}
                          className="flex mx-4 flex-col mt-4 sm:mt-0">
                          <div className="flex text-white text-base font-semibold">
                              {item?.title}
                          </div>
                          <div className="flex text-white text-xs">
                              {`${item?.value} / ${item?.max}`}
                          </div>
                          <div className="flex w-full h-1 bg-Green-2 mt-3">
                              <div
                                  className="flex bg-Green-1"
                                  style={{ width: percentLength }}
                              />
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>
  )
}

ItemConfigs.propTypes = {
  title: Proptypes.string,
  configs: Proptypes.array,
}

ItemConfigs.defaultProps = {
  title: 'Configurations',
  configs: defaultConfigs,
}

export default ItemConfigs;