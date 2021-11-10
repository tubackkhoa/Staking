import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
    marketAddress,
    nftAddress,
    tokenAddress,
    storeAddress,
    masterChefAddress,
    busdHowlPoolAddress,
} from '../../../../deployed_address.json'

import Marketplace from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'
import HowlToken from '../../../../artifacts/contracts/HowlToken.sol/HOWL.json'
import Store from '../../../../artifacts/contracts/Store.sol/Store.json'
import MasterChefAbi from '../../../../artifacts/contracts/MasterChef.sol/MasterChef.json'
import { configs } from 'config/config'

const connectWallet = async (cbDone, network = configs.Networks.BscTestnet.RPCEndpoints, cbError) => {
    console.log('Check in connectWallet network = ' + network);
    const web3Modal = new Web3Modal({
        network: network,
        cacheProvider: false,
    })
    // auto connect metamask wallet
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    // console.log({ signer })

    const userAddress = await signer.getAddress()
    const marketContract = new ethers.Contract(
        marketAddress,
        Marketplace.abi,
        signer
    )

    const gameItemContract = new ethers.Contract(
        nftAddress,
        GameItem.abi,
        signer
    )
    // console.log({ gameItemContract })

    const howlTokenContract = new ethers.Contract(
        tokenAddress,
        HowlToken?.abi,
        signer
    )

    const storeContract = new ethers.Contract(
        storeAddress,
        Store.abi,
        signer
    )

    const masterChefContract = new ethers.Contract(
        masterChefAddress,
        MasterChefAbi?.abi,
        signer
    )
    console.log({ masterChefContract })
    console.log('Check address = ' + masterChefContract.signer.address)

    const busdHowlPoolContract = new ethers.Contract(
        busdHowlPoolAddress,
        HowlToken?.abi,
        signer
    )

    cbDone && cbDone({ masterChefContract, userAddress, busdHowlPoolContract, signer, tokenContract: howlTokenContract })

    return { 
        marketplaceContract: marketContract, 
        gameItemContract, 
        signer, 
        howlTokenContract,
        storeContract,
        masterChefContract,
        busdHowlPoolContract,
        provider,
        userAddress,
    }
}

export default connectWallet
