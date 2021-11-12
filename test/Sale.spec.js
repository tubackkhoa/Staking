const chai = require("chai");
const { ethers, network } = require("hardhat");
const { solidity } = require("ethereum-waffle");

const { expect } = chai;
chai.use(solidity);

const DECIMALS = ethers.BigNumber.from(10).pow(18);
const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'; // ethers.utils.keccak256('MINTER_ROLE');
let ITO, TOKEN;
let Creator, SeedBuyer1, SeedBuyer2, PrivateBuyer1, PrivateBuyer2, PublicBuyer1, PublicBuyer2, EcoSystemWallet;

describe('Sale', () => {
  beforeEach(async () => {
    [Creator, SeedBuyer1, SeedBuyer2, PrivateBuyer1, PrivateBuyer2, PublicBuyer1, PublicBuyer2, EcoSystemWallet] = await ethers.getSigners();

    const DNFT = await ethers.getContractFactory('DNFT');

    const token = await upgrades.deployProxy(DNFT, { initializer: "init" });
    await token.deployed();

    const Sale = await ethers.getContractFactory('Sale');
    const sale = await upgrades.deployProxy(
      Sale,
      [
        'DNFT-Strategy', 
        'DNFT-Strategy',
        ethers.BigNumber.from(6_000_000_000).mul(DECIMALS),
        ethers.BigNumber.from(600_000).mul(DECIMALS),
        ethers.BigNumber.from(DECIMALS).div(10 ** 4), // 0.0001
        token.address,
        ethers.BigNumber.from(5).mul(DECIMALS), // 5%
        9 * 30 * 86400, // seconds
        9 * 30 * 86400 / 86400 // tranche
      ]
    );

    await sale.deployed();

    ITO = sale;
    TOKEN = token;
  });

  // total USD per $token
  const calcToken = async (amountUsd) => {
    // price x amountUSD
    const price = ethers.BigNumber.from(await ITO.price());
    return amountUsd.mul(DECIMALS).div(price);
  }

  describe('sale', () => {
    beforeEach(async () => {
      // setup price & token
      await TOKEN.grantRole(MINTER_ROLE, ITO.address);
    });

    it ('trigger OnSaleStarted', async () => {
      const res = await ITO.start();
      expect(res).to.emit(ITO, 'OnSaleStarted');
    });

    describe('start', () => {
      it('start & trigger event', async () => {
        const res = await ITO.start();
        expect(res).to.emit(ITO, 'OnSaleStarted');
        expect(await ITO.startTime()).to.be.gt(ethers.BigNumber.from(0));
      });

      it('re-start', async () => {
        await ITO.start();
        await expect(ITO.start()).to.be.revertedWith('can not restart');
      });
    });

    describe('close', () => {
      it('must be started', async () => {
        await expect(ITO.close()).to.be.revertedWith("not yet started");
      });

      it('re-close', async () => {
        await ITO.start();
        await ITO.close();
        await expect(ITO.close()).to.be.revertedWith("ended");
      });

      it('close & trigger event', async () => {
        await ITO.start();
        const res = await ITO.close();
        expect(res).to.emit(ITO, 'OnSaleEnded');
        expect(await ITO.endTime()).to.be.gt(ethers.BigNumber.from(0));
      });
    });

    // add to allowlist
    describe('started', () => {
      beforeEach(async () => {
        await ITO.start();
      });

      // buyFor
      it('buy for', async () => {
        const usd = ethers.BigNumber.from(1000).mul(DECIMALS); // $1000
        const total = await calcToken(usd);
        
        await ITO.buyFor(SeedBuyer1.address, total);
        expect(await ITO.totalSupply()).to.be.eq(total);
        expect(await ITO.balanceOf(SeedBuyer1.address)).to.be.eq(total);
      });
    });

    describe('claim', async () => {
      const tenThousandDolar = ethers.BigNumber.from(1000).mul(DECIMALS);
      const halfDolar = ethers.BigNumber.from(3).mul(DECIMALS).div(10000000);
      
      beforeEach(async () => {

        await ITO.start();

        // we need $ 600_000 in seed round
        const totalToken = await calcToken(tenThousandDolar);
        const totalTokenByHalfDolar = await calcToken(halfDolar);

        await ITO.buyFor(SeedBuyer1.address, totalToken.add(totalTokenByHalfDolar));
        await ITO.buyFor(SeedBuyer2.address, totalToken.sub(totalTokenByHalfDolar));
      });

      it('must be end of sale to claim', async () => {
        await expect(ITO.claims()).to.be.revertedWith('not ready to claim');
        await expect(ITO.enableClaim()).to.be.revertedWith('must be ended');
      });

      describe('unlock', async () => {
        beforeEach(async () => {
          // const price = await ITO.price();
          // const total = (await ITO.quantity()).div(price).mul(DECIMALS);

          // const remain = total.sub(tenThousandDolar.mul(2)); // s1 & s2 buyed

          // await USDT.mint(SeedBuyer1.address, remain);
          // await USDT.connect(SeedBuyer1).approve(ITO.address, remain);

          const quantity = await ITO.quantity();
          const totalBuyedSeed1 = await ITO.balanceOf(SeedBuyer1.address);
          const totalBuyedSeed2 = await ITO.balanceOf(SeedBuyer2.address);
          await ITO.buyFor(SeedBuyer1.address, quantity.sub(totalBuyedSeed1).sub(totalBuyedSeed2));
        });

        it('can claim and unlock 5%', async () => {

          const totalTokenBuyedBySeed1 = await ITO.balanceOf(SeedBuyer1.address);

          expect(await ITO.endTime()).to.be.gt(ethers.BigNumber.from(0));
          await ITO.enableClaim();

          expect(await ITO.unlockBalanceOf(SeedBuyer1.address),
            'first lock is 5%').to.be.eq(totalTokenBuyedBySeed1.mul(5).div(100));
        });

        it('can not claim without enable', async () => {
          try {
            await ITO.claims();
          } catch (e) {
            expect(e.message).to.be.contain('not ready to claim');
          }
        });

        describe('start claim', () => {
          let totalLockSeed1, totalLockSeed2;
          let initBalanceSeed1;
          let totalPreUnlockSeed1;
          beforeEach(async () => {
            totalLockSeed1 = await ITO.balanceOf(SeedBuyer1.address);
            totalLockSeed2 = await ITO.balanceOf(SeedBuyer2.address);
            initBalanceSeed1 = await TOKEN.balanceOf(SeedBuyer1.address);

            await ITO.enableClaim();

            totalPreUnlockSeed1 = await ITO.unlockBalanceOf(SeedBuyer1.address);
          });

          it('unlock', async () => {
            // time travel

            // const latest = await ethers.provider.getBlockNumber();
            // const blockInfo = await ethers.provider.getBlock(latest);

            const totalLockedRemaining = totalLockSeed1.sub(totalPreUnlockSeed1);
            const pricePerTranche = totalLockedRemaining.div(9 * 30 * 86400 / 86400);

            // start claim
            const startClaimTime = await ITO.startClaimTime();

            // // // after 1 day
            expect(await ITO.unlockable(SeedBuyer1.address, startClaimTime.add(86400)), 'no unlock').to.be.eq(totalPreUnlockSeed1);
            expect(await ITO.unlockable(SeedBuyer1.address, startClaimTime.add(86400 * 31)), 'first unlock').to.be.eq(totalPreUnlockSeed1.add(pricePerTranche));

            // 2 ys, full unlock
            expect(await ITO.unlockable(SeedBuyer1.address, startClaimTime.add(86400 * 365 * 2))).to.be.eq(totalLockSeed1);

            // 3month + 1hr
            expect(await ITO.unlockable(SeedBuyer1.address, startClaimTime.add(86400 * 30 * 3 + 60 * 60)))
              .to.be.eq(totalPreUnlockSeed1.add(pricePerTranche.mul(2 * 30)));

            // in realtime
            // step0: claim in 1 day
            // step1: claim in 3 days -> 1 day reward, because 1 month cliff
            // step2: claim in 26d + 3 days (4 days reward)
            // step3: claim in 1 month
            // step4: claim in 2 year

            // step0
            await network.provider.send("evm_increaseTime", [86400]);
            const claims0 = await ITO.connect(SeedBuyer1).claims();
            const newBalance0 = await TOKEN.balanceOf(SeedBuyer1.address);
            const preUnlock = totalPreUnlockSeed1;
            expect(newBalance0.sub(initBalanceSeed1), 'increase = preunlock').to.be.eq(
              preUnlock
            );

            // nothing to claims
            expect(claims0, 'too early, nothing to claims')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, ethers.BigNumber.from(0));
              
            // step1
            await network.provider.send("evm_increaseTime", [86400 * 3]);
            const claims1 = await ITO.connect(SeedBuyer1).claims();
            const totalUnlockInClaim1 = preUnlock.mul(0); // 0
            expect(claims1, 'total unlocked after 3 days')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, totalUnlockInClaim1);
            // total
            const newBalance1 = await TOKEN.balanceOf(SeedBuyer1.address);
            expect(newBalance1.sub(initBalanceSeed1), 'increase = prelock')
              .to.be.eq(preUnlock.add(totalUnlockInClaim1));

            // step2
            await network.provider.send("evm_increaseTime", [86400 * 29]);
            const claims2 = await ITO.connect(SeedBuyer1).claims();
            const totalUnlockInClaim2 = pricePerTranche.mul(3);
            expect(claims2, 'total unlocked after 3 days')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, totalUnlockInClaim2);
            const newBalance2 = await TOKEN.balanceOf(SeedBuyer1.address);
            expect(newBalance2.sub(initBalanceSeed1), 'increase = prelock + 3 days')
              .to.be.eq(preUnlock.add(totalUnlockInClaim1).add(totalUnlockInClaim2));

            // reclaim
            const claims2x = await ITO.connect(SeedBuyer1).claims();
            expect(claims2x, 'nothing to reclaim')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, ethers.BigNumber.from(0));

            // step3
            await network.provider.send("evm_increaseTime", [86400 * 30]);
            const claims3 = await ITO.connect(SeedBuyer1).claims();
            const totalUnlockInClaim3 = pricePerTranche.mul(30);
            expect(claims3, 'total unlocked after 1 month')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, totalUnlockInClaim3);
            const newBalance3 = await TOKEN.balanceOf(SeedBuyer1.address);
              expect(newBalance3.sub(initBalanceSeed1), 'increase = prelock + 3 days + 1 month')
                .to.be.eq(preUnlock.add(totalUnlockInClaim1.add(totalUnlockInClaim2).add(totalUnlockInClaim3)));

            // step4
            await network.provider.send("evm_increaseTime", [86400 * 365 * 2]);
            
            const totalUnlockInClaim4 = await ITO.balanceOf(SeedBuyer1.address);
            const claims4 = await ITO.connect(SeedBuyer1).claims();
            expect(claims4, 'total unlocked remaining')
              .to.emit(ITO, 'OnClaim')
              .withArgs(SeedBuyer1.address, totalUnlockInClaim4);
            const newBalance4 = await TOKEN.balanceOf(SeedBuyer1.address);
            expect(newBalance4,'full unlock').to.be.eq(totalLockSeed1.add(initBalanceSeed1));
          });
        });

        
      })
    });
  });


});