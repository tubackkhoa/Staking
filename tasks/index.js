const { task, types } = require('hardhat/config')

task('accounts', 'Prints the list of accounts').setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

task('balance', "Prints an account's balance")
    .addParam('account', "The account's address", undefined, types.string)
    .setAction(async (args, hre) => {
        const balance = await hre.ethers.provider.getBalance(args.account)
        console.log(hre.ethers.utils.formatEther(balance), 'ETH')
    })

task('mint', 'Mint NFT')
    .addOptionalParam('quantity', 'Number of NFT to be minted', 1, types.int)
    .addOptionalParam(
        'address',
        "The account's address",
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        types.string
    )
    .setAction(async (args, hre) => {
        const contractAbi = require('../artifacts/contracts/GameItem.sol/GameItem.json')
        const { nftAddress } = require('../deployed_address.json')

        const gameItem = new ethers.Contract(
            nftAddress,
            contractAbi.abi,
            await ethers.getSigner()
        )

        const quantity = Array.from(Array(args.quantity).keys())
        const res = await Promise.all(
            quantity.map(async _ => {
                let res = await gameItem.mintNFT(
                    args.address,
                    'https://gateway.pinata.cloud/ipfs/QmQvjYme4tR7xm3V9QHhNSRt5JzVzArgEQzdrHEUZko69g'
                )
                res = await res.wait()
                return 'done'
            })
        )
        console.log('minted')

        const balance = await gameItem.balanceOf(args.address)
        console.log(`NFT owned: ${balance.toString()}`)
    })

task('sale', 'create sale')
    .addOptionalParam('quantity', 'number of sale', 1, types.int)
    .setAction(async (args, hre) => {
        const marketAbi = require('../artifacts/contracts/Marketplace.sol/Marketplace.json')
        const nftAbi = require('../artifacts/contracts/GameItem.sol/GameItem.json')
        const { marketAddress, nftAddress} = require('../deployed_address.json')

        const signer = await ethers.getSigner()

        const market = new ethers.Contract(
            marketAddress,
            marketAbi.abi,
            signer
        )
        const nft = new ethers.Contract(
            nftAddress,
            nftAbi.abi,
            signer
        )

        const approval = await nft.approveAddress(marketAddress)
        await approval.wait()

        const quantity = Array.from(Array(args.quantity).keys())
        const res = await Promise.all(quantity.map(async it => {
            if (it == 0) return 'done'

            const created = await market.createSale(it, ethers.utils.parseEther((it * 1000) + ''))
            await created.wait()

            return 'done'
        }))
        console.log(res)
    })

module.exports = {}
