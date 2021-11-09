import { configs } from 'config/config'
import { ethers } from 'ethers'
import React from 'react'
import {
    marketAddress,
    nftAddress,
    storeAddress,
    masterChefAddress,
} from '../../../../deployed_address.json'
import MarketplaceAbi from '../../../../artifacts/contracts/Marketplace.sol/Marketplace.json'
import MasterChefAbi from '../../../../artifacts/contracts/MasterChef.sol/MasterChef.json'

// # MasterChef
// hien tai co 1 pool → poolId = 0
const POOL_ID = 0

const Container = props => {
    const [masterChef, setMasterChef] = React.useState()
    React.useEffect(() => {
        // getStakeContract()
        console.log({ storeContact: configs.storeContract })
    }, [])

    const getStakeContract = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            configs.Networks.BscTestnet.RPCEndpoints
        )
        const masterChefContract = new ethers.Contract(
            masterChefAddress,
            MasterChefAbi?.abi,
            provider
        )
        // global.masterChefContract = masterChefContract
        setMasterChef(masterChefContract)
        const userAddress = '0x63d02CD891402b6860EFF86ba1c8a99C77362D26' // harry acc 4
        getUserTokenStaked(masterChefContract, userAddress)
    }

    // test ok
    // ## userInfo: lay so luong token da stake
    const getUserTokenStaked = async (masterChefContract, userAddress) => {
        const info = await masterChefContract?.userInfo(POOL_ID, userAddress)
        console.log({ info })
        // info = { amount: BigNumber, lastDepositTimestamp: BigNumber, rewardDebt: BigNumber, staked: boolean}
        const amount = ethers.utils.formatEther(info?.amount)
        console.log({ amount }) // '0.0'
        const lastDepositTimestamp = ethers.utils.formatEther(info?.lastDepositTimestamp)
        console.log({ lastDepositTimestamp }) // '0.0'
        const rewardDebt = ethers.utils.formatEther(info?.rewardDebt)
        console.log({ rewardDebt }) // '0.0'
        console.log({ staked: info?.staked }) // false
    }

    // ## Deposit: stake token vao pool
    const stakeTokenToPool = async (masterChefContract, tokenContract, depositPrice = 100) => {

        if (typeof depositPrice !== 'number'){
            console.error('Invalid type depositPrice!')
            return
        }

        const unlimitedAllowance =
            '115792089237316195423570985008687907853269984665640564039457584007913129639935'
        const approve = await tokenContract?.approve(
            masterChefContract?.address,
            unlimitedAllowance
        )
        await approve.wait()

        // deposit
        const deposit = await masterChefContract.deposit(
            poolId,
            ethers?.utils?.parseEther(`${depositPrice}`)
        )
        await deposit.wait()
    }

    // Withdraw: lay token tu pool
    const getTokenFromPool = async (masterChefContract) => {
        const withdrawal = await masterChefContract.withdraw(
            poolId,
            ethers.utils.parseEther('50')
        )
        await withdrawal.wait()
    }

    return (
        <div className="flex flex-1 justify-center items-center px-12">
            <h1 className="flex text-white font-bold text-4xl text-center">
                HOWL Staking Liquidity pool coming soon!
            </h1>
        </div>
    )
}

export default Container
