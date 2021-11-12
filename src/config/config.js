const unlimitedAllowance =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'

// Testnet(ChainID 0x61, 97 in decimal)
const Networks = {
    Default: null,
    HardHat: {
        ChainId: {
            decimal: 1337,
            hex: '0x539',
        },
        RPCEndpoints: 'http://localhost:8545',
    },
    BscTestnet: {
        ChainId: {
            decimal: 97,
            hex: '0x61',
        },
        RPCEndpoints: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    },
    BscMainnet: {
        ChainId: {
            decimal: 56,
            hex: '0x38',
        },
        RPCEndpoints: 'https://bsc-dataseed.binance.org/',
    },
}

let tokenContract = null
let masterChefContract = null
let signer = null
let walletProvider = null
let userAddress = null
let busdDareNFTPoolContract = null

Networks.Default = Networks[process.env.NETWORD || 'HardHat']

export const configs = {
    unlimitedAllowance,
    Networks,
    tokenContract,
    masterChefContract,
    signer,
    walletProvider,
    userAddress,
    busdDareNFTPoolContract,
}
