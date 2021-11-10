
const unlimitedAllowance = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

// Testnet(ChainID 0x61, 97 in decimal)
const Networks = {
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
let marketContract = null
let gameItemContract = null
let storeContract = null
let masterChefContract = null
let signer = null
let walletProvider = null
let userAddress = null
let busdHowlPoolContract = null

export const configs = {
  unlimitedAllowance,
  Networks,
  tokenContract,
  marketContract,
  gameItemContract,
  storeContract,
  masterChefContract,
  signer,
  walletProvider,
  userAddress,
  busdHowlPoolContract,
}

