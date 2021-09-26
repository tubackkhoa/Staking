import { icons } from 'assets'
import { colors } from 'config/colors'
import Link from 'next/link'

const ConnectWalletButton = () => {
    const _onClickConnectWallet = () => {}
    return (
        <button
            onClick={_onClickConnectWallet}
            style={{
                display: 'flex',
                minWidth: '150px',
                height: '40px',
                borderRadius: '10px',
                borderWidth: 1,
                borderColor: colors.redViolet,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
            }}
        >
            <p
                style={{
                    display: 'flex',
                    color: colors.redViolet,
                    fontSize: '14px',
                    lineHeight: '21px',
                }}
            >
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
        <nav
            className="bg-hwl-gray-1"
            style={{ display: 'flex', width: 'auto' }}
        >
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    height: 40,
                    margin: '32px 64px 32px 64px',
                    flexDirection: 'row',
                }}
            >
                <a
                    style={{
                        color: '#F2F2F2',
                        fontSize: 26,
                        lineHeight: '32px',
                        fontWeight: 600,
                    }}
                >
                    {'HowlCity'}
                </a>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#1B1A21',
                        height: 40,
                        borderRadius: 10,
                        minWidth: 332,
                        marginLeft: 72,
                        padding: '0px 16px 0px 16px',
                    }}
                >
                    <img style={{ width: 24, height: 24 }} src={icons.search} />
                    <input
                        style={{
                            display: 'flex',
                            color: '#FFFFFF',
                            backgroundColor: 'transparent',
                            marginLeft: 10,
                        }}
                        placeholder={'Search Item'}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0px 32px 0px 32px',
                    }}
                >
                    {topics.map((item, index) => {
                        const { id, title } = item
                        return (
                            <p
                                key={id}
                                style={{
                                    color: '#F2F2F2',
                                    margin: '0px 12px 0px 12px',
                                    fontSize: 16,
                                    lineHeight: '24px',
                                    fontWeight: '600',
                                }}
                            >
                                {title}
                            </p>
                        )
                    })}
                </div>
                <ConnectWalletButton />
            </div>
        </nav>
    )
}

export default MainAppNav
