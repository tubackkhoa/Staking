require('hardhat-watcher')
require('hardhat-deploy-ethers')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-ethers')

// const { ethers } = require("ethers"); // do not include ethers
const { task } = require('hardhat/config')

require('dotenv').config()

task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

const fs = require('fs')
const { convertCSVToArray } = require('convert-csv-to-array')
task('import_sale')
    .addParam('type', 'round type')
    .addParam('round', 'round address')
    .addParam('file', 'csv file')
    .setAction(async (taskArgs, hre) => {
        const Sale = await hre.ethers.getContractFactory('Sale')
        const sale = Sale.attach(taskArgs.round)

        const content = fs.readFileSync(taskArgs.file, { encoding: 'utf-8' })
        const data = content
            .split('\n')
            .map(x => x.split(',').map(s => s.trim()))

        const DECIMALS = hre.ethers.BigNumber.from(10).pow(18)
        for (let row of data) {
            const [name, id, seedToken, privToken, totalToken, bep20] = row
            if (bep20) {
                if (taskArgs.type === 'seed') {
                    if (seedToken === '0') continue

                    fs.appendFileSync(
                        __dirname + '/report-seed.csv',
                        id + ',' + bep20,
                        { encoding: 'utf-8' }
                    )
                    const tx = await sale.buyFor(
                        bep20,
                        hre.ethers.BigNumber.from(seedToken).mul(DECIMALS)
                    )
                    console.log('buy for', { bep20, seedToken, tx: tx.hash })
                    fs.appendFileSync(
                        __dirname + '/report-seed.csv',
                        ',' + tx.hash,
                        { encoding: 'utf-8' }
                    )
                    try {
                        await tx.wait()
                        fs.appendFileSync(
                            __dirname + '/report-seed.csv',
                            ',' + 'ok',
                            { encoding: 'utf-8' }
                        )
                    } catch (e) {
                        fs.appendFileSync(
                            __dirname + '/report-seed.csv',
                            ',' + 'fail',
                            { encoding: 'utf-8' }
                        )
                    }

                    fs.appendFileSync(__dirname + '/report-seed.csv', '\n', {
                        encoding: 'utf-8',
                    })
                } else if (taskArgs.type == 'priv') {
                    if (privToken === '0') continue

                    fs.appendFileSync(
                        __dirname + '/report-priv.csv',
                        id + ',' + bep20,
                        { encoding: 'utf-8' }
                    )
                    const tx = await sale.buyFor(
                        bep20,
                        hre.ethers.BigNumber.from(privToken).mul(DECIMALS)
                    )
                    console.log('buy for', { bep20, privToken, tx: tx.hash })
                    fs.appendFileSync(
                        __dirname + '/report-priv.csv',
                        ',' + tx.hash,
                        { encoding: 'utf-8' }
                    )
                    try {
                        await tx.wait()
                        fs.appendFileSync(
                            __dirname + '/report-priv.csv',
                            ',' + 'ok',
                            { encoding: 'utf-8' }
                        )
                    } catch (e) {
                        fs.appendFileSync(
                            __dirname + '/report-priv.csv',
                            ',' + 'fail',
                            { encoding: 'utf-8' }
                        )
                    }

                    fs.appendFileSync(__dirname + '/report-priv.csv', '\n', {
                        encoding: 'utf-8',
                    })
                }
            }
        }
    })

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    // defaultNetwork: "",

    networks: {
        hardhat: {
            chainId: 1337,
        },
        // rinkeby: {
        //   url: 'https://rinkeby.infura.io/v3/0720d1c4ec394f4090d9be740db47db0',
        //   accounts: [process.env.DNFT_PRIVATE_KEY],
        //   chainId: 4,
        // },
        // kaitest: {
        //   url: 'https://dev-1.kardiachain.io',
        //   chainId: 0,
        //   accounts: [process.env.DNFT_PRIVATE_KEY],
        //   from: '0xc820736f06ee3A488B0dcbD131807584d33489F1',
        //   gasPrice: 8000000000,
        // },
        bsctest: {
            url: 'https://data-seed-prebsc-1-s3.binance.org:8545',
            accounts: [process.env.DNFT_PRIVATE_KEY],
            chainId: 97,
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
        },
    },

    solidity: {
        compilers: [
            {
                version: '0.8.4',
            },
        ],
        overrides: {},
    },

    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://bscscan.com/
        apiKey: process.env.ETHER_SCAN_KEY,
    },

    watcher: {
        ci: {
            files: ['./contracts', './test'],
            tasks: [
                'clean',
                {
                    command: 'compile',
                    params: { quiet: true },
                },
                {
                    command: 'test',
                    params: {
                        noCompile: true,
                        testFiles: ['test/Sale.spec.js'],
                    },
                },
            ],
        },
    },
}
