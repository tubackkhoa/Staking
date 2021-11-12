const ethers = require('ethers')
const axios = require('axios')

const tokenAbi = require('../../artifacts/contracts/DNFT.sol/DNFT.json')
const masterChefAbi = require('../../artifacts/contracts/MasterChef.sol/MasterChef.json')
const {
    tokenAddress,
    masterChefAddress,
} = require('../../deployed_address.json')

const NUM_DNFT_PER_POOL = 3000019.68
const lpAddress = '0x6d662dc7b435f07cc7ec12507f65aab2d5b0d5d5'
const busdAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/'
)

// from const
const lpToken = new ethers.Contract(lpAddress, tokenAbi.abi, provider)

const busdToken = new ethers.Contract(busdAddress, tokenAbi.abi, provider)

const masterChef = new ethers.Contract(
    masterChefAddress,
    masterChefAbi.abi,
    provider
)

const dnft = new ethers.Contract(tokenAddress, tokenAbi.abi, provider)

const getLpTokenPoolAPR = async (dnftPrice, liquidity) => {
    const totalValueDfntToken = NUM_DNFT_PER_POOL * dnftPrice

    return (totalValueDfntToken / liquidity) * 100
}

const getStakedDNFT = async () => {
    let numStakedDfnt = await masterChef.totalStakedDNFT()
    numStakedDfnt = parseFloat(ethers.utils.formatEther(numStakedDfnt))
    return numStakedDfnt
}

const getDareNFTPoolAPR = async numStakedDfnt => {
    return (NUM_DNFT_PER_POOL / numStakedDfnt) * 100
}

const getDNFTPrice = async () => {
    const res = await axios({
        method: 'get',
        url: 'https://api.pancakeswap.info/api/v2/tokens/0x549cc5df432cdbaebc8b9158a6bdfe1cbd0ba16d',
    })

    let price = res.data.data.price
    price = '0.' + price.substr(20)
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

const getLpStakedDNFT = async () => {
    let numStaked = await dnft.balanceOf(lpAddress)
    numStaked = parseFloat(ethers.utils.formatEther(numStaked))

    return numStaked
}

const getLpLiquidity = async dnftPrice => {
    const numBUSD = await getLpStakedBUSD()
    const numDNFT = await getLpStakedDNFT()

    return numDNFT * dnftPrice + numBUSD * 1
}

const getLpTokenPrice = async dnftPrice => {
    const liquidity = await getLpLiquidity(dnftPrice)
    const lpTokenSupply = await getTotalLpToken()

    return liquidity / lpTokenSupply
}

export const poolData = async () => {
    const dnftPrice = await getDNFTPrice()
    const lpTokenPrice = await getLpTokenPrice(dnftPrice)

    const numStakedDNFT = await getStakedDNFT()
    const dnftLiquidity = dnftPrice * numStakedDNFT
    const dnftPoolAPR = await getDareNFTPoolAPR(numStakedDNFT)

    const numStakedLpToken = await getStakedLpToken()
    const lpTokenPoolLiquidity = lpTokenPrice * numStakedLpToken
    const lpTokenPoolAPR = await getLpTokenPoolAPR(
        dnftPrice,
        lpTokenPoolLiquidity
    )

    return { dnftPoolAPR, lpTokenPoolAPR, dnftLiquidity, lpTokenPoolLiquidity }
}
