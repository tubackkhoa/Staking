import { icons } from 'assets'
import { colors } from 'config/colors'
import Link from 'next/link'

const ConnectWalletButton = () => {
    const _onClickConnectWallet = () => {}
    return (
        <button
            className="flex justify-center items-center"
            onClick={_onClickConnectWallet}
            style={{
                minWidth: '150px',
                height: '40px',
                borderRadius: '10px',
                borderWidth: 1,
                borderColor: colors.redViolet,
                marginLeft: 'auto',
            }}>
            <p
                className="flex"
                style={{
                    color: colors.redViolet,
                    fontSize: '14px',
                    lineHeight: '21px',
                }}>
                {'Connect wallet'}
            </p>
        </button>
    )
}

const MainAppNav = () => {
    const topics = [
        {
            id: 0,
            title: 'Explore',
        },
        {
            id: 1,
            title: 'My favorites',
        },
        {
            id: 2,
            title: 'Lend',
        },
        {
            id: 3,
            title: 'Borrow',
        },
    ]

    return (
        <nav className="bg-hwl-gray-1 flex w-full">
            <div
                className="flex flex-1 flex-row"
                style={{
                    height: 40,
                    margin: '32px 0px 32px 0px',
                    paddingRight: '64px'
                }}>
                <div className="flex w-1/6 px-20">
                    <a
                        className="flex"
                        style={{
                            color: '#F2F2F2',
                            fontSize: 26,
                            lineHeight: '32px',
                            fontWeight: 600,
                        }}>
                        {'HowlCity'}
                    </a>
                </div>
                <div
                    className="flex flex-row items-center flex-1"
                    style={{
                        backgroundColor: '#1B1A21',
                        height: '40px',
                        borderRadius: '10px',
                        minWidth: '332px',
                        marginLeft: '30px',
                        padding: '0px 16px 0px 16px',
                    }}>
                    <img
                        style={{ width: '24px', height: '24px' }}
                        src={icons.search}
                    />
                    <input
                        className="flex flex-1"
                        style={{
                            color: '#FFFFFF',
                            backgroundColor: 'transparent',
                            marginLeft: 10,
                            outline: 'none',
                        }}
                        placeholder={'Search Item'}
                    />
                </div>
                <div
                    className="flex flex-row justify-center items-center"
                    style={{ margin: '0px 32px 0px 32px' }}>
                    {topics.map((item, index) => {
                        const { id, title } = item
                        return (
                            <button
                                key={id}
                                className="font-semibold"
                                style={{
                                    color: '#F2F2F2',
                                    margin: '0px 12px 0px 12px',
                                    fontSize: 16,
                                    lineHeight: '24px',
                                }}>
                                {title}
                            </button>
                        )
                    })}
                </div>
                <ConnectWalletButton />
            </div>
        </nav>
    )
}

export default MainAppNav
