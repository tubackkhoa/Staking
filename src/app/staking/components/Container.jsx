/* eslint-disable @next/next/no-img-element */
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
import { icons } from 'assets'
import connectWallet from 'app/main-app/wallet'
import classNames from 'classnames'
import { formatToCurrency } from 'utils'

// # MasterChef
// hien tai co 1 pool → poolId = 0
const POOL_ID = 0

const stakeCouple = [
    {
        id: 0,
        key: 'hwl-busd-0',
        couple: [
            {
                id: 0,
                icon: icons.howl,
            },
            {
                id: 1,
                icon: icons.busd,
            },
        ],
        name: 'HWL-USDB',
        earned: 0,
        apr: 42.14,
        liquidity: 594406633, // 594,406,633
        multiplier: 40, // 40x
    },
]

const ActionTypes = {
    Stake: 'Stake',
    Unstake: 'Unstake',
}

const Container = props => {
    React.useEffect(() => {
        connectWallet()
        // setTimeout(async ()=>{
        //     // const userAddress = await configs.signer.getAddress()
        //     const userAddress = configs.userAddress
        //     console.log({ userAddress })
        //     testStakeContract(userAddress)
        // }, 5000)
        console.log({ storeContact: configs.storeContract })
    }, [])
    const [poolSelect, setPoolSelect] = React.useState()
    const [actionType, setAction] = React.useState(ActionTypes.Stake)
    const [amount, setAmount] = React.useState(0)

    const testStakeContract = async userAddress => {
        // const userAddress = '0x9d6835a231473Ee95cF95742b236C1EA40814460' // harry acc 4
        getUserTokenStaked(configs.masterChefContract, userAddress)
        stakeTokenToPool(
            configs.masterChefContract,
            configs.tokenContract,
            POOL_ID,
            100
        )
        // getTokenFromPool(configs.masterChefContract, POOL_ID, 50)
    }

    // test ok
    // ## userInfo: lay so luong token da stake // testing: WIP
    const getUserTokenStaked = async (masterChefContract, userAddress) => {
        const info = await masterChefContract?.userInfo(POOL_ID, userAddress)
        console.log({ info })

        if (!info) {
            console.error('info undefined!')
            return
        }
        // info = { amount: BigNumber, lastDepositTimestamp: BigNumber, rewardDebt: BigNumber, staked: boolean}
        const amount = ethers.utils.formatEther(info?.amount)
        console.log({ amount }) // '0.0'
        const lastDepositTimestamp = ethers.utils.formatEther(
            info?.lastDepositTimestamp
        )
        console.log({ lastDepositTimestamp }) // '0.0'
        const rewardDebt = ethers.utils.formatEther(info?.rewardDebt)
        console.log({ rewardDebt }) // '0.0'
        console.log({ staked: info?.staked }) // false
    }

    // ## Deposit: stake token vao pool // testing: WIP
    const stakeTokenToPool = async (
        masterChefContract,
        tokenContract,
        poolId,
        depositPrice = 100
    ) => {
        if (typeof depositPrice !== 'number') {
            console.error('Invalid type depositPrice!')
            return
        }
        console.log({ masterChefContract })
        console.log({ tokenContract })
        console.log({ poolId })
        console.log({ depositPrice })

        if (
            !masterChefContract ||
            !tokenContract ||
            isNaN(poolId) ||
            typeof tokenContract?.approve !== 'function' ||
            typeof masterChefContract?.deposit !== 'function'
        ) {
            console.error('stakeTokenToPool invalid contract!')
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
            ethers?.utils?.parseEther(`1000`)
        )
        await deposit.wait()
        console.log({ deposit })
    }

    // Withdraw: lay token tu pool // testing: WIP
    const getTokenFromPool = async (
        masterChefContract,
        poolId,
        amount = 1000
    ) => {
        const withdrawal = await masterChefContract?.withdraw(
            poolId,
            ethers.utils.parseEther(`${amount}`)
        )
        await withdrawal?.wait()
    }

    const renderComingSoon = () => {
        return (
            <h1 className="flex text-white font-bold text-4xl text-center">
                HOWL Staking Liquidity pool coming soon!
            </h1>
        )
    }

    const renderStakeRow = (item, index) => {
        const {
            key,
            couple = [],
            name = '',
            earned = 0,
            apr = 0,
            liquidity = 0,
            multiplier = 0,
        } = item

        if (!couple || !Array.isArray(couple) || couple.length < 2) return null

        return (
            <div
                key={key}
                className="flex flex-row items-center justify-between w-full h-20 border-b-0.5 border-Border-1 mb-2 px-9">
                <div className="flex flex-row">
                    {couple.map((item, index) => {
                        const { id, icon } = item
                        return (
                            <img
                                key={`couple-${id}`}
                                className="flex w-7 h-7"
                                src={icon}
                            />
                        )
                    })}
                    <p className="flex ml-4 text-Purple-2 text-base font-semibold">
                        {name}
                    </p>
                </div>
                <div className="flex flex-col">
                    <p className="flex text-Purple-2 font-semibold text-base">
                        {'Earned'}
                    </p>
                    <p className="flex text-base text-white mt-2">
                        {`$${earned}`}
                    </p>
                </div>
                {/* <div className="flex flex-col">
                    <p className="flex text-Purple-2 font-semibold text-base">
                        {'APR'}
                    </p>
                    <p className="flex text-base text-white mt-2">
                        {`${apr}%`}
                    </p>
                </div> */}
                {/* <div className="flex flex-col">
                    <p className="flex text-Purple-2 font-semibold text-base">
                        {'Liquidity'}
                    </p>
                    <p className="flex text-base text-white mt-2">
                        {`$${liquidity}`}
                    </p>
                </div> */}
                {/* <div className="flex flex-col">
                    <p className="flex text-Purple-2 font-semibold text-base">
                        {'Multiplier'}
                    </p>
                    <p className="flex text-base text-white mt-2">
                        {`${multiplier}x`}
                    </p>
                </div> */}
            </div>
        )
    }

    const renderStakeCoupleList = () => {
        return (
            <div className="flex flex-1 mt-6 flex-col">
                {stakeCouple.map(renderStakeRow)}
            </div>
        )
    }

    const StakingButton = () => {
        const [text, setText] = React.useState('')
        const onChange = event => {
            setText(event?.target?.value)
        }
        return (
            <div className="flex flex-col mt-24">
                <input className="h-8 w-48" onChange={onChange} />
            </div>
        )
    }

    const PoolContainer = ({
        couple,
        name,
        tokenStaked,
        tokenRewarded,
        onClick,
    }) => {
        return (
            <button
                onClick={onClick}
                className="flex flex-col p-4 sm:p-6 bg-Gray-20 rounded-3xl w-68 sm:w-[342px] mx-7 hover:ring hover ring-white mt-4 sm:mt-0">
                <div className="flex flex-row self-center">
                    <div className="flex flex-row">
                        <img
                            className="flex left-0 w-8 h-8"
                            src={couple[0]}
                            alt="image-howl"
                        />
                        <img
                            className="flex left-2 w-8 h-8"
                            src={couple[1]}
                            alt="image-usdb"
                        />
                    </div>
                    <p className="flex text-white font-semibold text-lg ml-2.5">
                        {name}
                    </p>
                </div>
                <div className="flex flex-col mt-9 w-full">
                    <div className="flex flex-row w-full justify-between">
                        <p className="flex text-Gray-3">Token staked</p>
                        <p className="flex text-white">{`${tokenStaked}Pancake LPs`}</p>
                    </div>
                    <div className="flex flex-row w-full justify-between mt-4">
                        <p className="flex text-Gray-3">Token rewarded</p>
                        <p className="flex text-white">{`${tokenRewarded}Pancake LPs`}</p>
                    </div>
                </div>
            </button>
        )
    }

    const onClickHowlHowl = () => {}

    const onClickBusdHowl = () => {}

    const Segment = ({ isSelect, title, onClick }) => {
        const selectStyle = isSelect ? 'bg-white' : ''
        const titleSelect = isSelect ? 'text-Blue-2' : 'text-white'
        return (
            <button
                onClick={onClick}
                className={classNames(
                    'flex flex-1 rounded-xl justify-center items-center ',
                    selectStyle
                )}>
                <p
                    className={classNames(
                        'flex text-base font-bold',
                        titleSelect
                    )}>
                    {title}
                </p>
            </button>
        )
    }

    return (
        <div className="flex flex-1 p-4 sm:p-12 flex-col">
            <div className="flex flex-col self-center">
                <h1 className="flex text-white text-3xl sm:text-5xl font-semibold">
                    Liquidity pool
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row mt-4 sm:mt-12 self-center">
                <PoolContainer
                    couple={[icons.howl, icons.howl]}
                    name={'HOWL/HOWL'}
                    tokenStaked={1200}
                    tokenRewarded={200}
                    onClick={onClickHowlHowl}
                />
                <PoolContainer
                    couple={[icons.busd, icons.howl]}
                    name={'BUSD/HOWL'}
                    tokenStaked={24500}
                    tokenRewarded={1200}
                    onClick={onClickBusdHowl}
                />
            </div>
            <div className="flex flex-col mt-12 self-center items-center">
                <div className="flex flex-row w-[268px] h-10 bg-Gray-4 rounded-xl">
                    <Segment
                        key="stake-button"
                        isSelect={actionType === ActionTypes.Stake}
                        title="Stake"
                        onClick={() => setAction(ActionTypes.Stake)}
                    />
                    <Segment
                        key="unstake-button"
                        isSelect={actionType === ActionTypes.Unstake}
                        title="Unstake"
                        onClick={() => setAction(ActionTypes.Unstake)}
                    />
                </div>
                <p className="flex text-Gray-5 font-base mt-12 text-center max-w-2xl sm:max-w-[464px]">
                    Single-sided Liquidity Mining First, you need to deposit
                    your tokens into the liquidity pools. Then, use the returned
                    HOWL-LP or BUSD-LP tokens and stake them to the HWL/BUSD
                    liquidity pool on this page
                </p>
                <div className="flex flex-col mt-12">
                    <div className="flex rounded-xl border border-Gray-4 bg-transparent w-full sm:w-[464px] outline-none h-14 flex-row items-center px-5">
                        <img
                            className="flex w-7 h-7"
                            src={icons.howl}
                            alt="icon-Input"
                        />
                        <p className="flex text-white text-xl font-semibold ml-2.5">
                            {'HWL'}
                        </p>
                        <input
                            placeholder={'0'}
                            maxLength={10}
                            className="flex w-full bg-transparent outline-none text-white text-right font-semibold text-2xl"
                            value={amount}
                            onChange={(event)=>{
                                setAmount(formatToCurrency(event?.target?.value, ''))
                            }}
                        />
                    </div>
                </div>
                <button className="flex justify-center items-center mt-5 rounded-xl bg-Blue-2 w-full h-12">
                    <p
                        className={classNames(
                            'flex text-base font-bold',
                            'text-white'
                        )}>
                        {'Stake'}
                    </p>
                </button>
            </div>
        </div>
    )
}

export default Container
