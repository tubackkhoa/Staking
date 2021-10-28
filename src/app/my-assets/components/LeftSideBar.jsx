import { icons } from 'assets'
import { useState } from 'react'
import classNames from 'classnames'

const LeftSideBar = () => {
    const options = [
        {
            id: 0,
            title: 'My NFTs Bike',
            onClick: () => undefined,
        },
        {
            id: 1,
            title: 'My active sales',
            onClick: () => undefined,
        },
        {
            id: 2,
            title: 'My purchased sales',
            onClick: () => undefined,
        },
    ]

    const [optionSelect, setOptionSelect] = useState(options[0])

    return (
        <div className="flex-col items-center border-r-0 p-8 hidden xl:flex w-96">
            <div className="flex-col">
                {options.map(item => {
                    const { id, title } = item
                    const isSelect = id === optionSelect?.id

                    const _onClick = () => {
                        setOptionSelect(item)
                    }

                    const selectedStyle = isSelect ? "bg-Blue-1" : ""

                    return (
                        <button
                            key={id}
                            className={classNames(
                                'flex items-center mt-4 rounded-lg w-52 h-12 px-4 py-2 hover:bg-gray-500',
                                selectedStyle
                            )}
                            onClick={_onClick}>
                            <a className="text-white">{title}</a>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default LeftSideBar
