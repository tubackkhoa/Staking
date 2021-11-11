import React from 'react'
import PropTypes from 'prop-types'
import { icons } from 'assets'
import classNames from 'classnames'
import { ethers } from 'ethers'

const PoolCard = ({
    couple,
    name,
    tokenStakedName,
    tokenRewardedName,
    onClick,
    isSelect,
    masterChefContract,
    userAddress,
    poolId,
}) => {
    console.log({ poolId })
    console.log({ userAddress })
    const [userAmount, setUserAmount] = React.useState('0')
    const [userPendingAmount, setUserPendingAmount] = React.useState('0')
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        getUserTokenStaked()
    }, [])

    const getUserTokenStaked = async () => {
        if (
            !userAddress ||
            isNaN(poolId) ||
            !masterChefContract ||
            `${userAddress}`.length < 5
        ) {
            setLoading(false)
            return
        }

        // get amount token user staked
        try {
            const info = await masterChefContract?.userInfo(0, userAddress)
            console.log({ info })
            if (!info) {
                console.error('Info undefined!')
                setLoading(false)
                return
            }
            // info = { amount: BigNumber, lastDepositTimestamp: BigNumber, rewardDebt: BigNumber, staked: boolean}
            const amountNumber = ethers.utils.formatEther(info?.amount)
            setUserAmount(amountNumber)
        } catch (error) {
            console.error(error)
        }

        // get amount token user rewarded
        // try {
        //     const pending = await masterChefContract?.pendingHowl(
        //         poolSelect?.poodId,
        //         userAddress
        //     )
        //     console.log({ pending })
        //     const pendingNumber = ethers.utils.formatEther(pending)
        //     console.log({ pendingNumber })
        //     setUserPendingAmount(pendingNumber)
        // } catch (error) {
        //     console.error(error)
        // }
    }

    const selectStyle = isSelect ? 'ring' : 'opacity-50'
    
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
                    <p className="flex text-Gray-3">Token staked</p>
                    <p className="flex text-white">{`${userAmount} ${tokenStakedName}`}</p>
                </div>
                <div className="flex flex-row w-full justify-between mt-4">
                    <p className="flex text-Gray-3">Token pending</p>
                    <p className="flex text-white">{`${userPendingAmount} ${tokenRewardedName}`}</p>
                </div>
            </div>
        </button>
    )
}

PoolCard.propTypes = {
    style: PropTypes.object,
    couple: PropTypes.array,
    name: PropTypes.string,
    tokenStakedName: PropTypes.string,
    tokenRewardedName: PropTypes.string,
    onClick: PropTypes.func,
    isSelect: PropTypes.bool,
    masterChefContract: PropTypes.any,
    userAddress: PropTypes.string,
    poolId: PropTypes.number,
}

PoolCard.defaultProps = {
    style: {},
    couple: [icons.howl, icons.howl],
    name: 'HWL',
    tokenStakedName: 'HWL',
    tokenRewardedName: 'HWL',
    onClick: () => undefined,
    isSelect: false,
    masterChefContract: null,
    userAddress: '',
    poolId: 0,
}

export default PoolCard
