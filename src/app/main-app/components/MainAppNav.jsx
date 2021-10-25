import { icons } from 'assets'
import { colors } from 'config/colors'
import { useRouter } from 'next/dist/client/router'
import connectWallet from '../wallet'
import Link from 'next/link'
import { routes } from 'config/routes'
import { globalKeys } from 'config/globalKeys'
import { useGlobal } from 'reactn'

const ConnectWalletButton = () => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    const _onClickConnectWallet = () => {
        const wallet = connectWallet()
        console.log({ wallet })
        if (!wallet) {
            console.log('connectWallet failed!')
            return
        }
        const {
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        } = wallet
        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        })
    }

    if (walletInfo?.marketplaceContract) return null

    return (
        <button
            onClick={_onClickConnectWallet}
            className="flex h-10 w-40 rounded-lg justify-center items-center ml-auto"
            style={{
                borderWidth: 1,
                borderColor: colors.redViolet,
            }}>
            <p
                className="flex text-sm"
                style={{
                    color: colors.redViolet,
                }}>
                {'Connect wallet'}
            </p>
        </button>
    )
}

const SearchBar = () => {
    return (
        <div
            className="flex flex-row items-center h-10"
            style={{
                backgroundColor: '#1B1A21',
                borderRadius: 10,
                minWidth: 332,
                marginLeft: 72,
                padding: '0px 16px 0px 16px',
            }}>
            <img style={{ width: 24, height: 24 }} src={icons.search} />
            <input
                style={{
                    display: 'flex',
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    marginLeft: 10,
                    outline: 'none',
                    border: 'none',
                }}
                placeholder={'Search Item'}
            />
        </div>
    )
}

const MainAppNav = ({ showSearchBar = false }) => {
    const route = useRouter()
    const navRoutes = [
        {
            id: 'Explore',
            title: 'Explore',
            route: routes.mainApp,
            onClick: () => {
                route.push(routes.mainApp)
            },
        },
        {
            id: 'Store',
            title: 'Store',
            route: routes.storePage,
            onClick: () => {
                route.push(routes.storePage)
            },
        },
        {
            id: 'myAssets',
            title: 'My assets',
            route: routes.myAssets,
            onClick: () => {
                route.push(routes.myAssets)
            },
        },
        {
            id: 'lending',
            title: 'Lend',
            route: routes.lending,
            onClick: () => {
                route.push(routes.lending)
            },
        },
        {
            id: 'Borrow',
            title: 'Borrow',
            route: routes.borrow,
            onClick: () => {
                route.push(routes.borrow)
            },
        },
    ]

    const renderRoutes = () => {
        return (
            <div className="hidden md:flex flex-1 flex-row justify-center items-center mx-8 my-0">
                {navRoutes.map((item, index) => {
                    const { id, title, onClick } = item
                    const isCurrentRoute = item.route === route.pathname
                    return (
                        <button
                            key={`navRoute-${id}`}
                            onClick={onClick}
                            className="flex mx-4 my-0 flex-col transition duration-500 group ease-in-out transform hover:-translate-y-1 hover:scale-110">
                            <p className="flex text-gray-300 group-hover:text-white text-base font-semibold">
                                {title}
                            </p>
                            {!!isCurrentRoute && (
                                <div className="flex bg-Blue-1 w-full mt-2 h-1"/>
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }

    const renderLogoAndName = () => {
        return (
            <Link href="/">
                <div className="flex flex-wrap items-center text-white text-3xl font-semibold">
                    <img
                        src="/howl.png"
                        alt="HowlCity"
                        className="flex h-12 w-12"
                    />
                    <span className="ml-4">{'HowlCity'}</span>
                </div>
            </Link>
        )
    }

    return (
        <nav className="bg-nav-bar w-full shadow-nav">
            <div className="flex flex-1 flex-row mx-8 py-4">
                {renderLogoAndName()}
                {!!showSearchBar && <SearchBar />}
                {renderRoutes()}
                <ConnectWalletButton />
            </div>
        </nav>
    )
}

export default MainAppNav
