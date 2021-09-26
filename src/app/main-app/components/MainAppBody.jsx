import { icons } from 'assets'
import { useState } from 'react'
import { nfts } from './dummy'

const LeftSideBar = () => {
    const options = [
        {
            id: 0,
            title: 'Moto-bike',
            onClick: () => undefined,
        },
        {
            id: 1,
            title: 'Accessories',
            onClick: () => undefined,
        },
        {
            id: 2,
            title: 'Performance pack',
            onClick: () => undefined,
        },
        {
            id: 3,
            title: 'Classic collections',
            onClick: () => undefined,
        },
    ]

    const [optionSelect, setOptionSelect] = useState(options[0]);

    return (
        <div
            className="flex w-1/6 h-20 flex-col items-center"
            style={{ padding: '30px' }}>
            <div className="flex flex-row" style={{ paddingLeft: '15px' }}>
                <a className="flex text-white">Marketplace</a>
                <img
                    style={{ width: '24x', height: '24px', marginLeft: '24px' }}
                    src={icons.arrowDown}
                />
            </div>
            <div className="flex-col" style={{ marginTop: '30px' }}>
                {options.map((item, index) => {
                    const { id, title, onClick } = item
                    const isSelect = id === optionSelect?.id;
                    const selectedStyle = isSelect ? { backgroundColor: '#4664F0' } : {}
                    const _onClick = () => {
                        setOptionSelect(item)
                    }
                    return (
                        <button
                            key={id}
                            className="flex items-center"
                            onClick={_onClick}
                            style={{
                                width: '196px',
                                height: '40px',
                                margin: '12px 0px 12px 0px',
                                borderRadius: '8px',
                                ...selectedStyle,
                                paddingLeft: '35px',
                            }}>
                            <a className="text-white">{title}</a>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

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
            }}>
            {filterOptions.map((item, index) => {
                const { id, title, onClick } = item
                const _onClick = () => undefined;
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
                        }}>
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

const NFTGridView = () => {
    return (
        <div
            className="flex flex-wrap bg-hwl-gray-1"
            style={{ height: '800px', overflowY: 'scroll', paddingTop: '24px' }}>
            {nfts.map((item, index) => {
                const { id, title, image, star, like, price, tokenCode } = item
                return (
                    <button
                        key={id}
                        className="flex flex-col"
                        style={{
                            width: '200px',
                            height: '300px',
                            backgroundColor: '#2A2D3A',
                            borderRadius: '30px',
                            marginLeft: '24px',
                            marginTop: '24px',
                            padding: '12px',
                        }}>
                        <img
                            className="flex"
                            style={{
                                width: '182px',
                                height: '182px',
                                borderRadius: '20px',
                            }}
                            src={image}
                        />
                        <div
                            className="flex flex-1 flex-col items-left w-full"
                            style={{ marginTop: '10px' }}>
                            <a
                                className="text-white text-left"
                                style={{ fontSize: '14px' }}>
                                {title}
                            </a>
                            <div
                                className="flex flex-row items-center w-full"
                                style={{ marginTop: '4px' }}>
                                <a
                                    className="flex text-white"
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}>
                                    {price}
                                </a>
                                <a
                                    className="flex text-white"
                                    style={{
                                        fontSize: '12px',
                                        marginLeft: '4px',
                                    }}>
                                    {tokenCode}
                                </a>
                                <img
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        marginLeft: 'auto',
                                    }}
                                    src={icons.heart}
                                />
                                <a
                                    className="flex text-white"
                                    style={{
                                        marginLeft: '3px',
                                        fontSize: '12px',
                                    }}>
                                    {like}
                                </a>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

const MainAppBody = () => {
    return (
        <div className="flex flex-1">
            <LeftSideBar />
            <div className="flex flex-1 flex-col">
                <QuickFilterBar />
                <NFTGridView />
            </div>
        </div>
    )
}

MainAppBody.propTypes = {}

MainAppBody.defaultProps = {}

export default MainAppBody
