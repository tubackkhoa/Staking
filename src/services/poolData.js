//import ethers from 'ethers'
//import axios from 'axios'
//
//import tokenAbi from '../../artifacts/contracts/HOWL.sol/HOWL.json'
//import { masterChefAddress } from '../../deployed_address.json'
//import configs from '../config/config.js'

const ethers = require('ethers')
const axios = require('axios')

const tokenAbi = require('../../artifacts/contracts/HOWL.sol/HOWL.json')
const masterChefAbi = require('../../artifacts/contracts/MasterChef.sol/MasterChef.json')
const { tokenAddress, masterChefAddress } = require('../../deployed_address.json')

const NUM_HWL_PER_POOL = 3000019.68
const lpAddress = '0x6d662dc7b435f07cc7ec12507f65aab2d5b0d5d5' 
const busdAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/'
)

const lpToken = new ethers.Contract(
    lpAddress,
    tokenAbi.abi,
    provider
)

const busdToken = new ethers.Contract(
    busdAddress,
    tokenAbi.abi,
    provider
)

const masterChef = new ethers.Contract(
    masterChefAddress,
    masterChefAbi.abi,
    provider
)

const howl = new ethers.Contract(
    tokenAddress,
    tokenAbi.abi,
    provider
)

const getLpTokenPoolAPR = async (howlPrice, liquidity) => {
    const totalValueHwlToken = NUM_HWL_PER_POOL * howlPrice
    
    return (totalValueHwlToken / liquidity) * 100
}

const getStakedHWL = async () => {
    let numStakedHwl = await masterChef.totalStakedHWL()
    numStakedHwl = parseFloat(ethers.utils.formatEther(numStakedHwl))
    return numStakedHwl
}

const getHowlPoolAPR = async (numStakedHwl) => {
    return (NUM_HWL_PER_POOL / numStakedHwl) * 100
}

const getHWLPrice = async () => {
    const res = await axios({
        method: 'get',
        url: 'https://api.pancakeswap.info/api/v2/tokens/0x549cc5df432cdbaebc8b9158a6bdfe1cbd0ba16d',
    })

    let price = res.data.data.price
    price = '0.' + price.substr(20,)
    price = parseFloat(price)

    return price
}

const getTotalLpToken = async () => {
    const totalSupply = await lpToken.totalSupply()
    return parseFloat(ethers.utils.formatEther(totalSupply))
}

const getStakedLpToken = async () => {
    let numStaked = await lpToken.balanceOf(masterChefAddress)
    numStaked = parseFloat(ethers.utils.formatEther(numStaked))

    return numStaked
}

const getLpStakedBUSD = async () => {
    let numStaked = await busdToken.balanceOf(lpAddress)
    numStaked = parseFloat(ethers.utils.formatEther(numStaked))

    return numStaked
}

const getLpStakedHWL = async () => {
    let numStaked = await howl.balanceOf(lpAddress)
    numStaked = parseFloat(ethers.utils.formatEther(numStaked))

    return numStaked
}

const getLpLiquidity = async (howlPrice) => {
    const numBUSD = await getLpStakedBUSD()
    const numHWL = await getLpStakedHWL()

    return numHWL * howlPrice + numBUSD * 1
}

const getLpTokenPrice = async (howlPrice) => {
    const liquidity = await getLpLiquidity(howlPrice)
    const lpTokenSupply = await getTotalLpToken()

    return liquidity / lpTokenSupply
}

const poolData = async () => {
    const howlPrice = await getHWLPrice()
    const lpTokenPrice = await getLpTokenPrice(howlPrice)

    const numStakedHWL = await getStakedHWL()
    const howlLiquidity = howlPrice * numStakedHWL
    const howlPoolAPR = await getHowlPoolAPR(numStakedHWL)

    const numStakedLpToken = await getStakedLpToken()
    const lpTokenPoolLiquidity = lpTokenPrice * numStakedLpToken
    const lpTokenPoolAPR = await getLpTokenPoolAPR(howlPrice, lpTokenPoolLiquidity)

    return { howlPoolAPR, lpTokenPoolAPR, howlLiquidity, lpTokenPoolLiquidity }
}
