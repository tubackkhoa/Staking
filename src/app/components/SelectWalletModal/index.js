/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { icons } from 'assets'
import connectWallet from 'app/main-app/wallet'

const SUPPORTED_WALLETS = [
    {
        id: 0,
        key: 'connect-Metamask',
        title: 'Metamask',
        icon: icons.metamask,
        onClick: () => {
            connectWallet()
        },
    },
    {
        id: 1,
        key: 'connect-Walletconnect',
        title: 'Wallet connect',
        icon: icons.walletconnect,
        onClick: () => {
            connectWallet()
        },
    },
]

export default function SelectWalletModal({
    open = true,
    onClose = () => null,
}) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={onClose}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay
                            className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                            onClick={onClose}
                        />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block align-bottom bg-Gray-21 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl leading-6 font-medium text-white">
                                        Connect Wallet
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <p className="text-lg text-white">
                                            I have read, understand, and agree
                                            to the
                                            <br />
                                            <a
                                                href={
                                                    'https://www.dareNFTcity.io/'
                                                }
                                                className="text-blue-600 mt-2">
                                                Terms of Service.
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                {SUPPORTED_WALLETS.map((item, index) => {
                                    const { icon, title } = item
                                    return (
                                        <button
                                            key={item?.key}
                                            type="button"
                                            className="mb-4 flex flex-row items-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-Gray-20 hover:bg-indigo-700 focus:outline-none"
                                            onClick={() => onClose(false)}>
                                            <img
                                                src={icon}
                                                className="w-10 h-10"
                                            />
                                            <p className="text-base font-medium text-white sm:text-sm ml-4">
                                                {title}
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
