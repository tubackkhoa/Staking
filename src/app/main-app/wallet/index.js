import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
    marketAddress,
    nftAddress,
    tokenAddress,
    storeAddress,
    masterChefAddress,
} from '../../../../deployed_address.json'

import Marketplace from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import HowlToken from '../../../../artifacts/contracts/HowlToken.sol/HOWL.json'
import Store from '../../../../artifacts/contracts/Store.sol/Store.json'
import MasterChefAbi from '../../../../artifacts/contracts/MasterChef.sol/MasterChef.json'
import { configs } from 'config/config'

const networks = {
    localhost: 'localhost',
}

const connectWallet = async () => {
    // console.log('Check in connectWallet');
    const web3Modal = new Web3Modal({
        network: configs.Networks.BscTestnet.RPCEndpoints,
        cacheProvider: false,
    })
    // auto connect metamask wallet
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    configs.walletProvider = provider
    const signer = provider.getSigner()
    configs.signer = signer

    const userAddress = await signer.getAddress()
    configs.userAddress = userAddress
    // console.log({ signer })

    const marketplaceContract = new ethers.Contract(
        marketAddress,
        Marketplace.abi,
        signer
    )
    configs.marketContract = marketplaceContract
    // console.log({ marketplaceContract })
    // console.log('Check address = ' + marketplaceContract.address)

    const gameItemContract = new ethers.Contract(
        nftAddress,
        GameItem.abi,
        signer
    )
    configs.gameItemContract = gameItemContract
    // console.log({ gameItemContract })

    const howlTokenContract = new ethers.Contract(
        tokenAddress,
        HowlToken.abi,
        signer
    )
    configs.tokenContract = howlTokenContract

    const storeContract = new ethers.Contract(
        storeAddress,
        Store.abi,
        signer
    )
    configs.storeContract = storeContract

    const masterChefContract = new ethers.Contract(
        masterChefAddress,
        MasterChefAbi?.abi,
        signer
    )
    // console.log({ masterChefContract })
    configs.masterChefContract = masterChefContract
    // console.log({ storeContract })

    return { marketplaceContract, gameItemContract, signer, howlTokenContract, storeContract }
}

export default connectWallet
