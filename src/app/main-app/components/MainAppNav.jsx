/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useGlobal } from 'reactn'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

import { icons } from 'assets'
import { colors } from 'config/colors'
import connectWallet from '../wallet'
import { routes } from 'config/routes'
import { globalKeys } from 'config/globalKeys'
import { SelectWalletModal } from './../../components'

const ConnectWalletButton = () => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)
    const [openWallets, setOpenWallets] = React.useState(false)

    const onClickConnectWalletButton = () => {
        setOpenWallets(true)
    }

    const onConnectMetamask = () => {
        const wallet = connectWallet()
        console.log({ wallet })
        if (!wallet) {
            console.log('connectWallet failed!')
            return
        }
        const { signer, dnftTokenContract } = wallet

        setWalletInfo({
            signer,
            dnftTokenContract,
        })
    }

    return (
        <>
            <button
                onClick={onClickConnectWalletButton}
                className="flex h-16 sm:h-10 w-24 sm:w-40 rounded-lg justify-center items-center ml-auto border-Purple-1 border">
                <p className="flex text-sm text-Purple-1">{'Connect wallet'}</p>
            </button>
            <SelectWalletModal
                open={openWallets}
                onClose={() => setOpenWallets(false)}
            />
        </>
    )
}

const SearchBar = () => {
    return (
        <div
            className="flex flex-row items-center h-10 ml-16 px-4 min-w-[332px] rounded-xl"
            style={{
                backgroundColor: '#1B1A21',
            }}>
            <img className="flex w-6 h-6" src={icons.search} />
            <input
                className="flex outline-none border-none ml-2.5 bg-transparent text-white"
                placeholder={'Search Item'}
            />
        </div>
    )
}

const MainAppNav = ({ showSearchBar = false }) => {
    const route = useRouter()
    const navRoutes = [
        {
            id: 'Marketplace',
            title: 'Marketplace',
            route: routes.mainApp,
            onClick: () => {
                route.push(routes.mainApp)
            },
        },
        {
            id: 'Staking',
            title: 'Staking',
            route: routes.staking,
            onClick: () => {
                route.push(routes.staking)
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
                                <div className="flex bg-Blue-1 w-full mt-2 h-1" />
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }

    const renderLogoAndName = () => {
        return (
            <Link href="/" passHref={true}>
                <div className="flex flex-wrap items-center text-white text-xl sm:text-3xl font-semibold">
                    <img
                        src="https://darenft.com/img/logo-web.webp"
                        style={{ width: '100%' }}
                        alt="Dare NFT"
                        className="flex h-12 w-12"
                    />
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
                {/* <ConnectWalletButton /> */}
            </div>
        </nav>
    )
}

export default MainAppNav
