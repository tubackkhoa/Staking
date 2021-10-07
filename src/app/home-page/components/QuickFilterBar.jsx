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
        <div className="flex bg-hwl-gray-3 flex-row items-center QuickFilterBar">
            {filterOptions.map((item, index) => {
                const { id, title, onClick } = item
                const _onClick = () => undefined

                return (
                    <button
                        onClick={_onClick}
                        key={id || index}
                        className="flex flex-row bg-hwl-gray-4 SearchItem">
                        <span className="text-white">{title}</span>
                        <img className="ArrowDownIcon" src={icons.arrowDown} />
                    </button>
                )
            })}
        </div>
    )
}

export default QuickFilterBar
