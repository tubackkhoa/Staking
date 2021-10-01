/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')

require('./tasks')

module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.0',
            },
        ],
    },
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: { chainId: 1337 },
        //rinkeby: {
        //    url: 'https://eth-rinkeby.alchemyapi.io/v2/ayHhac_uUumhuuKoRyrY0qzHkvDesmNk',
        //    accounts: [`0x${process.env.HOWL_PRIVATE_KEY}`],
        //},
        //kovan: {
        //    url: 'https://eth-kovan.alchemyapi.io/v2/w9r9s4NdWn2cqb2RpWwZO1NB13j4dLig',
        //    accounts: [`0x${process.env.HOWL_PRIVATE_KEY}`],
        //},
        //bsc_testnet: {
        //    url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        //    chainId: 97,
        //    gasPrice: 20000000000,
        //    accounts: [`0x${process.env.HOWL_PRIVATE_KEY}`],
        //},
        //bsc_mainnet: {
        //    url: 'https://bsc-dataseed.binance.org/',
        //    chainId: 56,
        //    gasPrice: 20000000000,
        //    accounts: [`0x${process.env.HOWL_PRIVATE_KEY}`],
        //},
    },
    mocha: {
        timeout: 20000,
    },
}
