import ethers from 'ethers'
import axios from 'axios'

const NUM_HWL_PER_POOL = 3000019.68

const calculateLpTokenPoolAPR = async (pricePerHwl, totalValueLpPool) => {
    const totalValueHwlToken = NUM_HWL_PER_POOL * pricePerHwl
    
    return (totalValueHwlToken / totalValueLpPool) * 100
}

const calculateHowlPoolAPR = async (numStakedHwl) => {
    return (NUM_HWL_PER_POOL / numStakedHwl) * 100
}

const getHowlTokenPrice = async () => {
    const res = await axios({
        method: 'get',
        url: 'https://api.pancakeswap.info/api/v2/tokens/0x549cc5df432cdbaebc8b9158a6bdfe1cbd0ba16d',
    })
    const price = res.data.data.price
    console.log(price.substr(2, 18))


}

getHowlTokenPrice()
