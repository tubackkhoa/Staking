const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

const parseEther = amount => ethers.utils.parseEther(amount)
const formatEther = amount => ethers.utils.formatEther(amount)

const poolInfoLog = poolInfo => {
    const info = {
        lpToken: poolInfo.lpToken,
        allocPoint: poolInfo.allocPoint.toNumber(),
        lastRewardBlock: poolInfo.lastRewardBlock.toNumber(),
        accDnftPerShare: poolInfo.accDnftPerShare.toNumber(),
    }
    console.log(info)
}

const userInfoLog = userInfo => {
    const info = {
        amount: formatEther(userInfo.amount),
        rewardDebt: formatEther(userInfo.rewardDebt),
    }
    console.log(info)
}

const logInfo = async (poolId, userAddress) => {
    const lpTokenInfo = await this.masterChef.poolInfo(poolId)
    poolInfoLog(lpTokenInfo)

    const userInfo = await this.masterChef.userInfo(poolId, userAddress)
    userInfoLog(userInfo)

    const dnftBal = await this.dnftToken.balanceOf(userAddress)
    console.log('dnft balance', formatEther(dnftBal))
}

describe('MasterChef', () => {
    before('set up', async () => {
        this.signers = await ethers.getSigners()

        // maximum value of 2^256-1
        this.unlimitedAllowance =
            '115792089237316195423570985008687907853269984665640564039457584007913129639935'

        const DNFT = await ethers.getContractFactory('DNFT')
        this.lpToken = await upgrades.deployProxy(DNFT, {
            initializer: 'init',
        })

        this.dnftToken = await upgrades.deployProxy(DNFT, {
            initializer: 'init',
        })
        await this.dnftToken.deployed()

        const blockNumber = await this.signers[0].provider.getBlockNumber()
        const MasterChef = await ethers.getContractFactory('MasterChef')
        this.masterChef = await upgrades.deployProxy(MasterChef, [
            this.dnftToken.address,
            this.signers[0].address,
            parseEther('0.57078'),
            blockNumber,
        ])
        await this.masterChef.deployed()

        console.log(
            'Liquidity Token Addr:',
            this.lpToken.address,
            this.dnftToken.address
        )
        const approved = await this.lpToken.approve(
            this.masterChef.address,
            this.unlimitedAllowance
        )
        await approved.wait()

        const dnftApproved = await this.dnftToken.approve(
            this.masterChef.address,
            this.unlimitedAllowance
        )
        await dnftApproved.wait()
    })

    it('distribute token', async () => {
        const mint = await this.dnftToken.mint(
            this.signers[0].address,
            parseEther('1000000')
        )
        await mint.wait()
        const mint1 = await this.dnftToken.mint(
            this.signers[1].address,
            parseEther('1000000')
        )
        await mint1.wait()
        const mint2 = await this.lpToken.mint(
            this.signers[2].address,
            parseEther('1000000')
        )
        await mint2.wait()
        const mint3 = await this.lpToken.mint(
            this.signers[3].address,
            parseEther('1000000')
        )
        await mint3.wait()
    })

    it('mint token to MasterChef', async () => {
        const minted = await this.dnftToken.mint(
            this.masterChef.address,
            parseEther('1000000')
        )
        await minted.wait()

        const balance = await this.dnftToken.balanceOf(this.masterChef.address)
        console.log('DNFT of MasterChef', formatEther(balance))
    })

    it('add lp staking pool', async () => {
        const pool = await this.masterChef.add(
            1000,
            this.lpToken.address,
            false
        )
        await pool.wait()

        const poolLength = await this.masterChef.poolLength()
        console.log('pool length:', poolLength.toNumber())

        const totalAllocPoint = await this.masterChef.totalAllocPoint()
        console.log('total alloc point:', totalAllocPoint.toNumber())
    })

    it('signers deposit', async () => {
        // change signer to signer1, with darenft token in poolId 1:DNFT, 0:lpToken
        const deposit = await this.masterChef
            .connect(this.signers[0])
            .deposit(0, parseEther('100'))
        await deposit.wait()

        console.log(
            'dnft balance',
            formatEther(await this.dnftToken.balanceOf(this.signers[0].address))
        )
    })

    it('withdraw', async () => {
        const pid = 1

        const withdrawed = await this.masterChef
            .connect(this.signers[1])
            .withdraw(pid, parseEther('0'))
        await withdrawed.wait()
        await logInfo(pid, this.signers[1].address)
    })

    it('pendingDnft', async () => {
        const pendingDfnt = await this.masterChef.pendingDnft(
            0,
            this.signers[1].address
        )
        console.log('pending', formatEther(pendingDfnt))
        await logInfo(0, this.signers[1].address)

        const pid = 1

        const pending = await this.masterChef.pendingDnft(
            pid,
            this.signers[2].address
        )
        console.log('pending', formatEther(pending))

        const res = await this.masterChef.totalAllocPoint()
        console.log(res.toNumber())

        const totalhwl = await this.masterChef.totalStakedDnft()
        console.log('total', formatEther(totalhwl))
    })
})
