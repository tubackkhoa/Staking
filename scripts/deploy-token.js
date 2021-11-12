const H = require('hardhat')
const fs = require('fs')

const DECIMALS = H.ethers.BigNumber.from(10).pow(18)

const { ethers } = H

async function deploy() {
    const DNFT = await ethers.getContractFactory('DNFT')
    const token = await H.upgrades.deployProxy(DNFT, { initializer: 'init' })
    await token.deployed()

    let obj = JSON.parse(fs.readFileSync('deployed_address.json'))
    obj.tokenAddress = token.address
    fs.writeFileSync('deployed_address.json', JSON.stringify(obj))

    console.log('DNFT deployed to:', token.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
