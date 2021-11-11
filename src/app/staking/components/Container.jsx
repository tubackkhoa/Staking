/* eslint-disable react-hooks/exhaustive-deps */
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
import { ActivityIndicator, Loading } from 'app/components'
import { toast } from 'react-toastify'
import { lang } from 'lang'
import { checkNetworkAndRequest } from 'services'
import PoolCard from './PoolCard'
import { poolData } from 'services/poolData'
import dayjs from 'dayjs'

const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
}

const APR_MIN = 450
const APR_MAX = 500

const Pools = {
    pool1: {
        poodId: 0,
        name: 'HOWL/HOWL',
        icons: [icons.howl, icons.howl],
        tokenStakedName: 'HWL',
        tokenRewardedName: 'HWL',
    },
    pool2: {
        poodId: 1,
        name: 'BUSD/HOWL',
        icons: [icons.busd, icons.howl],
        tokenStakedName: 'Token LPs',
        tokenRewardedName: 'Token LPs',
    },
}

const StakingContracts = {
    unlimitedAllowance: configs.unlimitedAllowance,
    tokenContract: null,
    masterChefContract: null,
    busdHowlPoolContract: null,
    signer: null,
    userAddress: null,
}

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

const calcTimeLockLeft = (time, hour = 48) => {
    const timeCanUnStake = time + 60 * 60 * hour
    const currentTimestamp = Date.now() / 1000
    return timeCanUnStake <= currentTimestamp
}

const Container = () => {
    React.useEffect(() => {
        checkNetworkAndRequest({
            chainId: configs.Networks.BscMainnet.ChainId.hex,
            rpcUrl: configs.Networks.BscMainnet.RPCEndpoints,
            onSuccess: () => {
                connectWalletAndGetContract()
            },
            onFailed: () => {
                setSigner(false)
            },
        })
    }, [])

    const connectWalletAndGetContract = () => {
        connectWallet(
            ({
                masterChefContract,
                userAddress,
                busdHowlPoolContract,
                signer,
                tokenContract,
            }) => {
                console.log({
                    masterChefContract,
                    userAddress,
                    busdHowlPoolContract,
                    signer,
                    tokenContract,
                })
                StakingContracts.masterChefContract = masterChefContract
                StakingContracts.userAddress = userAddress
                StakingContracts.busdHowlPoolContract = busdHowlPoolContract
                StakingContracts.signer = signer
                StakingContracts.tokenContract = tokenContract
                getData()
            }
        ),
            configs.Networks.BscMainnet.RPCEndpoints
    }

    const getData = () => {
        if (
            !StakingContracts.masterChefContract ||
            !StakingContracts.userAddress
        ) {
            connectWallet(({ masterChefContract, userAddress }) => {
                getUserTokenStaked(
                    masterChefContract,
                    userAddress,
                    poolSelect?.poodId
                )
            }, configs.Networks.BscMainnet.RPCEndpoints)
        } else {
            getUserTokenStaked(
                StakingContracts.masterChefContract,
                StakingContracts.userAddress,
                poolSelect?.poodId
            )
        }
    }

    const [poolSelect, setPoolSelect] = React.useState(Pools.pool1)
    const [actionType, setAction] = React.useState(ActionTypes.Stake)
    const [amount, setAmount] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [isSigner, setSigner] = React.useState(true)

    const [userAmount, setUserAmount] = React.useState('0')
    const [userPendingAmount, setUserPendingAmount] = React.useState('0')
    const [lockTimePool1, setLockTimePool1] = React.useState(null)

    const [userAmountPool2, setUserAmountPool2] = React.useState('0')
    const [userPendingAmountPool2, setUserPendingAmountPool2] =
        React.useState('0')
    const [userAddress, setUserAddress] = React.useState('')
    const [lockTimePool2, setLockTimePool2] = React.useState(null)

    const [aprPool1, setAprPool1] = React.useState(0)
    const [totalLiquidityPool1, setLiquidityPool1] = React.useState(0)

    const [aprPool2, setAprPool2] = React.useState(0)
    const [totalLiquidityPool2, setLiquidityPool2] = React.useState(0)

    const getUserTokenStaked = async (masterChefContract, userAddress) => {
        if (!userAddress || !masterChefContract) {
            setSigner(false)
            return
        }

        // get amount token user staked pool 1
        try {
            const info = await masterChefContract?.userInfo(
                Pools.pool1.poodId,
                userAddress
            )
            console.log({ info })
            if (!info) {
                console.error('Info undefined!')
                setSigner(false)
                return
            }
            // info = { amount: BigNumber, lastDepositTimestamp: BigNumber, rewardDebt: BigNumber, staked: boolean}
            const amountNumber = ethers.utils.formatEther(info?.amount)
            console.log({ amountNumber })
            setUserAmount(amountNumber)
            const lastDeposit1Number = info?.lastDepositTimestamp?.toNumber()
            // lastDepositTimestamp + (60 * 60 * 24 * 90) > unix time hien tai thi hien thi disable unstake va hien thi ra ngay` co the withdraw
            // lastDepositTimestamp + (60 * 60 * 24 * 90) <= unix time hien tai thi enable cai unstake
            console.log({ lastDeposit1Number })
            setLockTimePool1(lastDeposit1Number)
        } catch (error) {
            console.error(error)
        }

        // get amount token user staked pool 2
        try {
            const info = await masterChefContract?.userInfo(
                Pools.pool2.poodId,
                userAddress
            )
            console.log({ info })
            if (!info) {
                console.error('Info undefined!')
                setSigner(false)
                return
            }
            // info = { amount: BigNumber, lastDepositTimestamp: BigNumber, rewardDebt: BigNumber, staked: boolean}
            const amountNumberPool2 = ethers.utils.formatEther(info?.amount)
            console.log({ amountNumberPool2 })
            setUserAmountPool2(amountNumberPool2)
            const lastDeposit2Number = info?.lastDepositTimestamp?.toNumber()
            console.log({ lastDeposit2Number })
            setLockTimePool2(lastDeposit2Number)
        } catch (error) {
            console.error(error)
        }

        const {
            howlPoolAPR,
            lpTokenPoolAPR,
            howlLiquidity,
            lpTokenPoolLiquidity,
        } = await poolData()
        console.log({
            howlPoolAPR,
            lpTokenPoolAPR,
            howlLiquidity,
            lpTokenPoolLiquidity,
        })

        setAprPool1(howlPoolAPR ?? 0)
        setAprPool2(lpTokenPoolAPR ?? 0)
        setLiquidityPool1(howlLiquidity ?? 0)
        setLiquidityPool2(lpTokenPoolLiquidity ?? 0)

        // get amount token user rewarded pool 1
        try {
            const pending = await masterChefContract?.pendingHowl(
                Pools.pool1.poodId,
                userAddress
            )
            // console.log({ pending })
            const pendingNumber = ethers.utils.formatEther(pending)
            // console.log({ pendingNumber })
            setUserPendingAmount(pendingNumber)
        } catch (error) {
            console.error(error)
        }

        // get amount token user rewarded pool 2
        try {
            const pending = await masterChefContract?.pendingHowl(
                Pools.pool2.poodId,
                userAddress
            )
            // console.log({ pending })
            const pendingNumberPool2 = ethers.utils.formatEther(pending)
            // console.log({ pendingNumberPool2 })
            setUserPendingAmountPool2(pendingNumberPool2)
        } catch (error) {
            console.error(error)
        }
    }

    const stakeTokenToPool = async (
        masterChefContract,
        tokenContract,
        poolId,
        amount,
        cbDone = () => undefined,
        cbError = () => undefined
    ) => {
        if (isNaN(amount)) {
            setAmount(0)
            toast.warning('Invalid amount, please again!')
            return
        }

        console.log('Check stakeTokenToPool poolId = ' + poolId)

        if (
            !masterChefContract ||
            !tokenContract ||
            isNaN(poolId) ||
            typeof tokenContract?.approve !== 'function' ||
            typeof masterChefContract?.deposit !== 'function'
        ) {
            setSigner(false)
            toast.error(lang().transactionFailed)
            console.error({ masterChefContract, tokenContract, poolId })
            return
        }

        console.log('Check stakeTokenToPool amount = ' + amount)

        try {
            setLoading(true)
            const approve = await tokenContract?.approve(
                masterChefContract?.address,
                StakingContracts.unlimitedAllowance
            )
            await approve.wait()
            // deposit
            const deposit = await masterChefContract.deposit(
                poolId,
                ethers?.utils?.parseEther(`${amount}`)
            )
            await deposit.wait()
            cbDone && cbDone(deposit)
        } catch (error) {
            cbError && cbError(error)
        } finally {
            setLoading(false)
        }
    }

    const getTokenFromPool = async (
        masterChefContract,
        poolId,
        amount,
        cbDone,
        cbError
    ) => {
        if (typeof amount !== 'number') {
            toast.warning('Invalid amount, please again!')
            setAmount(0)
            return
        }
        try {
            setLoading(true)
            const withdrawal = await masterChefContract?.withdraw(
                poolId,
                ethers.utils.parseEther(`${amount}`)
            )
            await withdrawal?.wait()
            cbDone && cbDone()
        } catch (error) {
            cbError && cbError(error)
        } finally {
            setLoading(false)
        }
    }

    const PoolContainer = ({
        couple,
        name,
        tokenStaked,
        tokenStakedName,
        tokenRewarded,
        tokenRewardedName,
        onClick,
        isSelect,
        apr,
        liquidity,
    }) => {
        const selectStyle = isSelect ? 'ring' : 'opacity-50'
        // if (apr < APR_MIN || apr > APR_MAX) {
        //     apr = getRandomArbitrary(APR_MIN, APR_MAX)
        // }
        if (apr < APR_MIN) apr = APR_MIN
        if (apr > APR_MAX) apr = APR_MAX
        const aprFormatted = formatToCurrency(parseFloat(apr).toFixed(1), '')

        return (
            <button
                onClick={onClick}
                className={classNames(
                    'flex flex-col p-4 sm:p-6 bg-Gray-20 rounded-3xl w-68 sm:w-[342px] mx-7 hover:ring hover ring-white mt-8 sm:mt-0',
                    selectStyle
                )}>
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
                        <p className="flex text-Gray-3">APR</p>
                        <p className="flex text-white max-w-[120px] break-all">{`${aprFormatted}%`}</p>
                    </div>
                    <div className="flex flex-row w-full justify-between mt-4">
                        <p className="flex text-Gray-3">Total Liquidity</p>
                        <p className="flex text-white max-w-[120px] break-all">{`${liquidity} $`}</p>
                    </div>
                    <div
                        className="w-full bg-gray-400 mt-6"
                        style={{ height: '0.1px' }}
                    />
                    <div className="flex flex-row w-full justify-between mt-4">
                        <p className="flex text-Gray-3">Your token staked</p>
                        <p className="flex text-white">{`${tokenStaked} ${tokenStakedName}`}</p>
                    </div>
                    <div className="flex flex-row w-full justify-between mt-4">
                        <p className="flex text-Gray-3">Your rewarded</p>
                        <p className="flex text-white">{`${tokenRewarded} ${tokenRewardedName}`}</p>
                    </div>
                </div>
            </button>
        )
    }

    const onClickHowlHowl = () => {
        if (loading) return
        setPoolSelect(Pools.pool1)
    }

    const onClickBusdHowl = () => {
        if (loading) return
        setPoolSelect(Pools.pool2)
    }

    const onClickStakeButton = () => {
        if (loading) {
            toast.warn(lang().pleaseWaiting)
            return
        }
        if (!amount) return null
        const amountFloat = parseFloat(`${amount}`.replaceAll(',', ''))
        if (amountFloat < 1) {
            return
        }

        const timeLock =
            poolSelect.poodId === Pools.pool1.poodId
                ? lockTimePool1
                : lockTimePool2

        const isEnableUnStake =
            actionType === ActionTypes.Unstake
                ? calcTimeLockLeft(timeLock, 48)
                : true

        if (!isEnableUnStake) {
            toast.error(
                'Your token is still locked in the pool, please wait for the token lock time to expire!'
            )
            return
        }

        if (actionType === ActionTypes.Stake) {
            const contractByPool =
                poolSelect.poodId === 0
                    ? StakingContracts.tokenContract
                    : StakingContracts.busdHowlPoolContract
            stakeTokenToPool(
                StakingContracts.masterChefContract,
                contractByPool,
                poolSelect.poodId,
                amountFloat,
                () => {
                    setAmount(0)
                    toast.success('Your token has been staked successfully!')
                    getData()
                },
                () => {
                    toast.error(lang().transactionFailed)
                    getData()
                }
            )
            return
        }
        if (actionType === ActionTypes.Unstake) {
            getTokenFromPool(
                StakingContracts.masterChefContract,
                poolSelect.poodId,
                amountFloat,
                () => {
                    setAmount(0)
                    toast.success('Your token has been unstaked successfully!')
                    getData()
                },
                () => {
                    toast.error(lang().transactionFailed)
                    getData()
                }
            )
            return
        }
    }

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

    const onChangeAmount = event => {
        if (loading) {
            toast.warn(lang().pleaseWaiting)
            return
        }
        setAmount(event?.target?.value)
    }

    const renderStakeButton = () => {
        if (!amount) return null
        const isEnableStakeButton =
            parseFloat(`${amount}`.replaceAll(',', '')) > 1

        const timeLock =
            poolSelect.poodId === Pools.pool1.poodId
                ? lockTimePool1
                : lockTimePool2

        const isEnableUnStake =
            actionType === ActionTypes.Unstake
                ? calcTimeLockLeft(timeLock, 48)
                : true
        const enableStyle =
            isEnableStakeButton && isEnableUnStake ? 'bg-Blue-2' : 'bg-Gray-2'
        return (
            <button
                disabled={!isEnableStakeButton && !isEnableUnStake}
                onClick={onClickStakeButton}
                className={classNames(
                    'flex justify-center items-center mt-5 rounded-xl w-full h-12',
                    enableStyle
                )}>
                <p
                    className={classNames(
                        'flex text-base font-bold',
                        'text-white'
                    )}>
                    {'Stake'}
                </p>
                {loading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white ml-4" />
                )}
            </button>
        )
    }

    const WithdrawTimeLock = ({ isShow, timeStake, timeLockSecond }) => {
        if (!isShow) return null
        const timeUnLock = timeStake + timeLockSecond
        const timeLockLeft = dayjs.unix(timeUnLock).fromNow()
        return (
            <div className="flex text-Gray-3 font-medium text-base mt-2.5">
                {`Withdraw time lock: ${timeLockLeft}`}
            </div>
        )
    }

    const renderTutorial = () => {
        if (poolSelect.poodId === Pools.pool1.poodId) {
            return (
                <p className="flex text-Gray-5 font-base mt-12 text-center max-w-2xl sm:max-w-[640px]">
                    Single-sided Liquidity mining.
                    <br />
                    Stake your HWL tokens to the HWL/HWL liquidity pool on this
                    page
                    <br />
                    and get HWL rewards daily, hourly, block by block
                </p>
            )
        }
        return (
            <p className="flex text-Gray-5 font-base mt-12 text-center max-w-2xl sm:max-w-[640px]">
                Single-sided Liquidity mining. <br />
                First, go to https://pancakeswap.finance/ and add liquidity
                BUSD/HWL to get LP tokens <br />
                Then, use your HOWL-BUSD LP tokens (Cake-LP in your metamask){' '}
                <br />
                and stake them to the HWL/BUSD liquidity pool on this page
            </p>
        )
    }

    return (
        <>
            <div className="flex flex-1 p-4 sm:p-12 flex-col">
                <div className="flex flex-col self-center">
                    <h1 className="flex text-white text-3xl sm:text-5xl font-semibold mt-4 sm:mt-0">
                        Liquidity pool
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row mt-4 sm:mt-12 self-center">
                    <PoolContainer
                        couple={Pools.pool1.icons}
                        name={Pools.pool1.name}
                        tokenStaked={parseFloat(userAmount).toFixed(2)}
                        tokenStakedName={Pools.pool1.tokenStakedName}
                        tokenRewarded={[
                            parseFloat(userPendingAmount).toFixed(2),
                        ]}
                        tokenRewardedName={Pools.pool1.tokenRewardedName}
                        onClick={onClickHowlHowl}
                        isSelect={poolSelect.poodId === Pools.pool1.poodId}
                        apr={aprPool1}
                        liquidity={parseFloat(totalLiquidityPool1).toFixed(2)}
                    />
                    <PoolContainer
                        couple={Pools.pool2.icons}
                        name={Pools.pool2.name}
                        tokenStaked={parseFloat(userAmountPool2).toFixed(2)}
                        tokenStakedName={Pools.pool2.tokenStakedName}
                        tokenRewarded={parseFloat(
                            userPendingAmountPool2
                        ).toFixed(2)}
                        tokenRewardedName={Pools.pool2.tokenRewardedName}
                        onClick={onClickBusdHowl}
                        isSelect={poolSelect.poodId === Pools.pool2.poodId}
                        apr={aprPool2}
                        liquidity={parseFloat(totalLiquidityPool2).toFixed(2)}
                    />
                    {/* <PoolCard
                        couple={Pools.pool1.icons}
                        name={Pools.pool1.name}
                        tokenStakedName={Pools.pool1.tokenStakedName}
                        tokenRewardedName={Pools.pool1.tokenRewardedName}
                        onClick={onClickHowlHowl}
                        isSelect={poolSelect.poodId === Pools.pool1.poodId}
                        masterChefContract={StakingContracts.masterChefContract}
                        userAddress={StakingContracts.userAddress}
                        poolId={Pools.pool1.poodId}
                    />
                    <PoolCard
                        couple={Pools.pool2.icons}
                        name={Pools.pool2.name}
                        tokenStakedName={Pools.pool2.tokenStakedName}
                        tokenRewardedName={Pools.pool2.tokenRewardedName}
                        onClick={onClickBusdHowl}
                        isSelect={poolSelect.poodId === Pools.pool2.poodId}
                        masterChefContract={StakingContracts.masterChefContract}
                        userAddress={StakingContracts.userAddress}
                        poolId={Pools.pool2.poodId}
                    /> */}
                </div>
                <div className="flex flex-col mt-12 self-center items-center">
                    <div className="flex flex-row w-[268px] h-10 bg-Gray-4 rounded-xl">
                        <Segment
                            key="stake-button"
                            isSelect={actionType === ActionTypes.Stake}
                            title="Stake"
                            onClick={() =>
                                !loading && setAction(ActionTypes.Stake)
                            }
                        />
                        <Segment
                            key="unstake-button"
                            isSelect={actionType === ActionTypes.Unstake}
                            title="Unstake"
                            onClick={() =>
                                !loading && setAction(ActionTypes.Unstake)
                            }
                        />
                    </div>
                    {renderTutorial()}
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
                                value={formatToCurrency(amount, '')}
                                onChange={onChangeAmount}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        onClickStakeButton()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <WithdrawTimeLock
                        isShow={actionType === ActionTypes.Unstake}
                        timeStake={
                            poolSelect.poodId === Pools.pool1.poodId
                                ? lockTimePool1
                                : lockTimePool2
                        }
                        timeLockSecond={48 * 60 * 60}
                    />
                    {renderStakeButton()}
                </div>
            </div>
        </>
    )
}

export default Container
