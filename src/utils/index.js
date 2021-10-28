import Web3 from "web3";

export const getRandom = (min = 0, max) => Math.floor(Math.random() * (max - min)) + min;

export const detectEthereumNetwork = async () => {
    const web3 = await getWeb3();
    web3?.eth?.net?.getNetworkType().then(async (netId) => {
        console.log({ netId })
        // Do something based on which network ID the user is connected to
    });

    web3?.version?.getNetwork((err, netId) => {
        switch (netId) {
            case "1":
                console.log('This is mainnet')
                break
            case "2":
                console.log('This is the deprecated Morden test network.')
                break
            case "3":
                console.log('This is the ropsten test network.')
                break
            case "4":
                console.log('This is the Rinkeby test network.')
                break
            case "42":
                console.log('This is the Kovan test network.')
                break
            default:
                console.log('This is an unknown network.')
        }
    })
}

const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:3000';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Acccounts now exposed
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    FALLBACK_WEB3_PROVIDER
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Infura/Local web3.");
                resolve(web3);
            }
        });
    });
}

export const setupNetwork = async () => {
    const provider = window.ethereum;
    if (provider) {
        const chainId = parseInt(process.env.SUPPORTED_CHAIN_ID, 10);
        try {
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: `0x${chainId.toString(16)}`,
                    },
                ],
            });
            return true;
        } catch (error) {
            console.error("Failed to setup the network in Metamask:", error);
            if (error.code === -32002) {
                toast({
                    title:
                        "Permissions request already pending please wait. Please check you wallet",
                    status: "warning",
                });
            } else if (error.code === 4902) {
                try {
                    await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: `0x${chainId.toString(16)}`,
                                chainName: process.env.CHAIN_NAME,
                                nativeCurrency: {
                                    name: "ETH",
                                    symbol: "eth",
                                    decimals: 18,
                                },
                                rpcUrls: RPC_URLS,
                                blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL],
                            },
                        ],
                    });
                    return true;
                } catch (error) {
                    toast({
                        title: error?.message,
                        status: "error",
                    });
                    return false;
                }
            }
            return false;
        }
    } else {
        console.error(
            "Can't setup the BSC network on metamask because window.ethereum is undefined"
        );
        return false;
    }
};


export const parseMoneyInput = (value, currency = '') => {
    return `${currency}${value
        .replace(/(?!\.)\D/g, '')
        .replace(/(?<=\..*)\./g, '')
        .replace(/(?<=\.\d\d).*/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const utils = {
    getRandom,
    parseMoneyInput,
    detectEthereumNetwork,
}
