import { icons } from 'assets'
import { useState } from 'react'
import classNames from 'classnames'

const LeftSideBar = () => {
    const options = [
        {
            id: 0,
            title: 'Dirt Bike',
            onClick: () => undefined,
        },
        {
            id: 1,
            title: 'Sport Bike',
            onClick: () => undefined,
        },
        {
            id: 2,
            title: 'Scramble',
            onClick: () => undefined,
        },
    ]

    const [optionSelect, setOptionSelect] = useState(options[0])

    return (
        <div className="LeftSideBar flex w-1/6 flex-col items-center border-r-0 p-8 w-60">
            <div className="flex flex-row GroupMenu">
                <a className="flex text-white">Marketplace</a>
                <img className="ToggleBtn" src={icons.arrowDown} />
            </div>
            <div className="flex-col GroupMenuItems">
                {options.map(item => {
                    const { id, title } = item
                    const isSelect = id === optionSelect?.id

                    const _onClick = () => {
                        setOptionSelect(item)
                    }

                    return (
                        <button
                            key={id}
                            className={classNames(
                                'flex items-center GroupMenuItem',
                                { SelectedItem: isSelect }
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
