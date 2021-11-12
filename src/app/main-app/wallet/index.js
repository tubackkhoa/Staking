import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import {
    marketAddress,
    nftAddress,
    tokenAddress,
    storeAddress,
    masterChefAddress,
    busdDareNFTPoolAddress,
} from '../../../../deployed_address.json'

import DareNFTToken from '../../../../artifacts/contracts/DNFT.sol/DNFT.json'
import MasterChefAbi from '../../../../artifacts/contracts/MasterChef.sol/MasterChef.json'
import { configs } from 'config/config'

const connectWallet = async (
    cbDone,
    network = configs.Networks.BscTestnet.RPCEndpoints,
    cbError
) => {
    const web3Modal = new Web3Modal({
        network: network,
        cacheProvider: true,
    })
    // auto connect metamask wallet
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    // console.log({ signer })

    const userAddress = await signer.getAddress()

    const dnftTokenContract = new ethers.Contract(
        tokenAddress,
        DareNFTToken?.abi,
        signer
    )

    const masterChefContract = new ethers.Contract(
        masterChefAddress,
        MasterChefAbi?.abi,
        signer
    )
    // console.log({ masterChefContract })
    // console.log('Check address = ' + await masterChefContract.signer.getAddress())

    const busdDareNFTPoolContract = new ethers.Contract(
        busdDareNFTPoolAddress,
        DareNFTToken?.abi,
        signer
    )

    cbDone &&
        cbDone({
            masterChefContract,
            userAddress,
            busdDareNFTPoolContract,
            signer,
            tokenContract: dnftTokenContract,
        })

    return {
        signer,
        dnftTokenContract,
        masterChefContract,
        busdDareNFTPoolContract,
        provider,
        userAddress,
    }
}

export default connectWallet
