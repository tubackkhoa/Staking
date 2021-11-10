const NUM_HWL_PER_POOL = 3000019.68

const calculateLpTokenPoolAPR = async (pricePerHwl, totalValueLpPool) => {
    const totalValueHwlToken = NUM_HWL_PER_POOL * pricePerHwl
    
    return (totalValueHwlToken / totalValueLpPool) * 100
}

const calculateHowlPoolAPR = async (numStakedHwl) => {
    return (NUM_HWL_PER_POOL / numStakedHwl) * 100
}
