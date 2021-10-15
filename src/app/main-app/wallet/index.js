import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
    marketAddress,
    nftAddress,
    tokenAddress,
} from '../../../../deployed_address.json'

import Marketplace from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import HowlToken from '../../../../artifacts/contracts/HowlToken.sol/HowlToken.json'

const networks = {
    localhost: 'localhost',
}

const connectWallet = async () => {
    // console.log('Check in connectWallet');
    const web3Modal = new Web3Modal({
        network: networks.localhost,
        cacheProvider: false,
    })
    // auto connect metamask wallet
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    // console.log({ signer })

    const marketplaceContract = new ethers.Contract(
        marketAddress,
        Marketplace.abi,
        signer
    )
    // console.log({ marketplaceContract })
    // console.log('Check address = ' + marketplaceContract.address)

    const gameItemContract = new ethers.Contract(
        nftAddress,
        GameItem.abi,
        signer
    )
    // console.log({ gameItemContract })

    const howlTokenContract = new ethers.Contract(
        tokenAddress,
        HowlToken.abi,
        signer
    )
    // console.log({ howlTokenContract })

    return { marketplaceContract, gameItemContract, signer, howlTokenContract }
}

export default connectWallet
