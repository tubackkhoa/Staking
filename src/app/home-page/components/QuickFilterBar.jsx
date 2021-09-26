import { useState } from 'react'
import { icons } from 'assets'

const QuickFilterBar = () => {
    const filterOptions = [
        {
            id: 0,
            title: 'Recently release',
            onClick: () => {},
        },
        {
            id: 1,
            title: 'Price',
            onClick: () => {},
        },
        {
            id: 2,
            title: 'Star',
            onClick: () => {},
        },
        {
            id: 3,
            title: 'Speed',
            onClick: () => {},
        },
    ]
    return (
        <div
            className="flex bg-hwl-gray-3 flex-row items-center"
            style={{
                paddingLeft: '24px',
                height: '72px',
                margin: '0px 32px 0px 32px',
                borderRadius: '12px',
            }}
        >
            {filterOptions.map((item, index) => {
                const { id, title, onClick } = item
                const _onClick = () => undefined
                return (
                    <button
                        onClick={_onClick}
                        key={id || index}
                        className="flex flex-row bg-hwl-gray-4"
                        style={{
                            borderRadius: '8px',
                            padding: '12px 16px 12px 16px',
                            marginRight: '16px',
                            // overflow: 'scroll',
                        }}
                    >
                        <span className="text-white">{title}</span>
                        <img
                            style={{ width: 24, height: 24, marginLeft: '3px' }}
                            src={icons.arrowDown}
                        />
                    </button>
                )
            })}
        </div>
    )
}

export default QuickFilterBar
