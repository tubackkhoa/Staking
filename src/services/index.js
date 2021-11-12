import { ethers } from 'ethers'

import { checkNetworkAndRequest } from './checkNetwork'

const getBalanceOfToken = async ({ tokenCont }) => {
    const tokenBalance = ethers.utils.formatEther(
        await tokenCont?.balanceOf(signerAddress)
    )
    const balanceFloat = parseFloat(tokenBalance)
    return balanceFloat
}

export { getBalanceOfToken, checkNetworkAndRequest }
