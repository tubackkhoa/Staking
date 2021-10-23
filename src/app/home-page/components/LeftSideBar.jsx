import { icons } from 'assets'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'

const LeftSideBar = () => {
    const filters = [
        {
            id: 0,
            title: 'Dirt Bike',
            vehicleType: 'DirtBike',
            onClick: () => undefined,
        },
        {
            id: 1,
            title: 'Sport Bike',
            vehicleType: 'SportBike',
            onClick: () => undefined,
        },
        {
            id: 2,
            title: 'Scramble',
            vehicleType: 'Scramble',
            onClick: () => undefined,
        },
    ]

    const [filterActiveSale, setFilterActiveSale] = useGlobal(
        globalKeys.filterActiveSale
    )

    useEffect(() => {
        setFilterActiveSale(filters[0])
    }, [])

    return (
        <div className="LeftSideBar flex-col items-center border-r-0 p-8 w-60 hidden xl:flex xl:col-span-3">
            <div className="flex flex-row GroupMenu">
                <a className="flex text-white">Bike type</a>
                <img className="ToggleBtn" src={icons.arrowDown} />
            </div>
            <div className="flex-col GroupMenuItems">
                {filters.map(item => {
                    const { id, title } = item
                    const isSelect = id === filterActiveSale?.id

                    const _onClick = () => {
                        setFilterActiveSale(item)
                    }

                    return (
                        <button
                            key={id}
                            className={classNames(
                                'flex items-center GroupMenuItem hover:bg-gray-500',
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
