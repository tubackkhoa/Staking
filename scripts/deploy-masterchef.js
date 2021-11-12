const H = require('hardhat')
const fs = require('fs')

const DECIMALS = H.ethers.BigNumber.from(10).pow(18)
const parseEther = amount => ethers.utils.parseEther(amount)
const { ethers } = H

async function deploy() {
    const signers = await ethers.getSigners()
    const blockNumber = await signers[0].provider.getBlockNumber()
    let obj = JSON.parse(fs.readFileSync('deployed_address.json'))
    const MasterChef = await ethers.getContractFactory('MasterChef')
    const masterChef = await upgrades.deployProxy(MasterChef, [
        obj.tokenAddress,
        signers[0].address,
        parseEther('0.57078'),
        blockNumber,
    ])
    await masterChef.deployed()

    obj.masterChefAddress = masterChef.address
    fs.writeFileSync('deployed_address.json', JSON.stringify(obj))

    console.log('MasterChef deployed to:', masterChef.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
