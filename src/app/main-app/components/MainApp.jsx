import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { useEffect, useState  } from 'react'
import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

import {
  nftAddress,
  tokenAddress,
  marketAddress
} from '../../../../deployed_address.json'

import Marketplace from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import GameItem from '../../../../artifacts/contracts/GameItem.sol/GameItem.json'


const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        _init()
        loadNFTs()
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
      console.log*(myAssets);
  
    }
  

    useEffect(() => {
        _logMainAppContext()
    }, [state])

    const _logMainAppContext = () => {
        console.log(`App state: ${JSON.stringify(state)}`)
    }

    const _init = () => {
        dispatch(MainAppActions.sayHello())
    }

    return (
        <div className="flex flex-1 flex-col bg-hwl-gray-1 MainApp">
            <MainAppHead />
            <MainAppNav />
            <MainAppBody {...{ pageProps, Component }} />
            <MainAppFooter />
        </div>
    )
}

export default MainApp
