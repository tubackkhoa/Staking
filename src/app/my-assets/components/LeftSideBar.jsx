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
        <div className="LeftSideBar flex w-1/6 flex-col items-center border-r-0 p-8 w-60">
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
