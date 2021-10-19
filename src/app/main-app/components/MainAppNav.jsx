import { icons } from 'assets'
import { colors } from 'config/colors'
import { useRouter } from 'next/dist/client/router'
import connectWallet from '../wallet'
import Link from 'next/link'
import { routes } from 'config/routes'
import { globalKeys } from 'app/store'
import { useGlobal } from 'reactn'

const ConnectWalletButton = () => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    const _onClickConnectWallet = () => {
        const wallet = connectWallet()
        console.log({ wallet })
        if(!wallet){
            console.log('connectWallet failed!')
            return;
        }
        const {  marketplaceContract, gameItemContract, signer, howlTokenContract } = wallet;
        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        })
    }

    if(walletInfo?.marketplaceContract) return null;

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
    const topics = [
        {
            id: 0,
            title: 'Explore',
            onClick: () => {
                route.push(routes.mainApp)
            },
        },
        {
            id: 1,
            title: 'My assets',
            onClick: () => {
                route.push(routes.myAssets)
            },
        },
        {
            id: 2,
            title: 'Lend',
            onClick: () => {
                route.push(routes.lending)
            },
        },
        {
            id: 3,
            title: 'Borrow',
            onClick: () => {
                route.push(routes.borrow)
            },
        },
    ]

    return (
        <nav className="bg-nav-bar flex w-full shadow-nav">
            <div className="flex flex-1 flex-row mx-8 py-4">
                <Link href="/">
                    <a
                        className="flex flex-wrap items-center text-white text-3xl font-semibold">
                        <img
                            src="/howl.png"
                            alt="HowlCity"
                            className="flex h-12 w-12"
                        />
                        <span className="ml-4">{'HowlCity'}</span>
                    </a>
                </Link>
                {!!showSearchBar && <SearchBar />}
                <div
                    className="flex flex-1 flex-row justify-center items-center"
                    style={{ margin: '0px 32px 0px 32px' }}>
                    {topics.map((item, index) => {
                        const { id, title, onClick } = item
                        return (
                            <button
                                key={`topics-${id}`}
                                onClick={onClick}
                                className="flex"
                                style={{ margin: '0px 16px 0px 16px' }}>
                                <p className="flex text-white text-base font-semibold">
                                    {title}
                                </p>
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
