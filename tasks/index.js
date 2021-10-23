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
        //'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0xccD6CB5034C15C63761070433cE436F5C4636501',
        types.string
    )
    .setAction(async (args, hre) => {
        const ownerAddress = '0x9d6835a231473Ee95cF95742b236C1EA40814460' // Harry's account 1
        const quantityCreate = 2

        const contractAbi = require('../artifacts/contracts/GameItem.sol/GameItem.json')
        const { nftAddress } = require('../deployed_address.json')

        const gameItem = new ethers.Contract(
            nftAddress,
            contractAbi.abi,
            await ethers.getSigner()
        )

        for (let i = 0; i < quantityCreate; i++) {
            const NFTImageUri = 'https://gateway.pinata.cloud/ipfs/QmQvjYme4tR7xm3V9QHhNSRt5JzVzArgEQzdrHEUZko69g'
            const NFTScrambleHarry = 'https://gateway.pinata.cloud/ipfs/QmR2QbMvt8c4dsN4qSehLRgnQMBoaNxF6XoZNMd1ZxuZX1' // pinata/Scramble_Bike_Green_Pro_113.json 
            const scramble3Json = 'https://gateway.pinata.cloud/ipfs/QmUCGZ3eUGoH3gtyeRjEd6QDphw1K8r2KFCax1BP21E5RY' // pinata/scramble3.json 
            const dirtbike1Json = 'https://gateway.pinata.cloud/ipfs/QmVmZx7V39Kke3fy8qfwz5DLkJwYHxuUoJ9uDahYmJPtRk'
            
            let res = await gameItem.mintNFT(
                ownerAddress,
                dirtbike1Json, // have to JSON file
            )
            res = await res.wait()
        }

        //const quantity = Array.from(Array(args.quantity).keys())
        //const res = await Promise.all(
        //    quantity.map(async _ => {
        //        let res = await gameItem.mintNFT(
        //            args.address,
        //            'https://gateway.pinata.cloud/ipfs/QmQvjYme4tR7xm3V9QHhNSRt5JzVzArgEQzdrHEUZko69g'
        //        )
        //        res = await res.wait()
        //        return 'done'
        //    })
        //)
        console.log('minted')

        const balance = await gameItem.balanceOf(ownerAddress)
        console.log(`NFT owned: ${balance.toString()}`)
    })

task('sale', 'create sale')
    .addOptionalParam('quantity', 'number of sale', 1, types.int)
    .setAction(async (args, hre) => {
        const marketAbi = require('../artifacts/contracts/Marketplace.sol/Marketplace.json')
        const nftAbi = require('../artifacts/contracts/GameItem.sol/GameItem.json')
        const { marketAddress, nftAddress } = require('../deployed_address.json')

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

        if (!(await nft.isApprovedForAll(signer.address, marketAddress))) {
            const approval = await nft.approveAddress(marketAddress)
            await approval.wait()
        }


        for (let i = 31; i <= 50; i++) {
            const created = await market.createSale(i, ethers.utils.parseEther( (i * 1000 ) + ''))
            await created.wait()
            console.log(`created sale for tokenId ${i}`)
        }
        console.log('done')

        //const quantity = Array.from(Array(args.quantity).keys())
        //const res = await Promise.all(quantity.map(async it => {
        //    if (it == 0) return 'done'

        //    const created = await market.createsale(it, ethers.utils.parseether((it * 1000) + ''))
        //    await created.wait()

        //    return 'done'
        //}))
        //console.log(res)
    })

module.exports = {}
