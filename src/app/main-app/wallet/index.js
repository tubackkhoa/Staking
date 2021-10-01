import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
    nftAddress,
    tokenAddress,
    marketAddress,
} from '../../../../deployed_address.json'

import Marketplace from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'

const connectWallet = async () => {
    const web3Modal = new Web3Modal({
        network: 'localhost',
        cacheProvider: false,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(
        marketAddress,
        Marketplace.abi,
        signer
    )
    const gameItemContract = new ethers.Contract(
        nftAddress,
        GameItem.abi,
        signer
    )

    return { marketplaceContract, gameItemContract, signer }
}

export default connectWallet
