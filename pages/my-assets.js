import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftAddress,
  tokenAddress,
  marketAddress
} from '../deployed_address.json'

import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../artifacts/contracts/GameItem.sol/GameItem.json'

const MyAssets = () => {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
    console.log('Check loadNFTs')
  }, [])

  const loadNFTs = async () => {
    // connect wallet
    const web3Modal = new Web3Modal({
      network: "localhost", // rinkeby // mainnet
      cacheProvider: false,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    // create marketContract
    const marketplaceContract = new ethers.Contract(marketAddress, Marketplace.abi, signer)
    const gameItemContract = new ethers.Contract(nftAddress, GameItem.abi, provider)

    const myAssets = await gameItemContract.balanceOf(signer._address);


  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default MyAssets;