const H = require('hardhat')
const fs = require('fs')

const DECIMALS = H.ethers.BigNumber.from(10).pow(18)
const parseEther = amount => ethers.utils.parseEther(amount)

const { ethers } = H

async function mint() {
    let obj = JSON.parse(fs.readFileSync('deployed_address.json'))
    const signers = await ethers.getSigners()
    const DNFT = await ethers.getContractFactory('DNFT')
    const lpTokenAbi = require('../artifacts/contracts/DNFT.sol/DNFT.json').abi
    const dnftToken = new ethers.Contract(
        obj.tokenAddress,
        lpTokenAbi,
        signers[0]
    )

    // mint token
    const mint = await dnftToken.mint(signers[0].address, parseEther('1000000'))
    await mint.wait()

    console.log(mint)
}

mint()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
