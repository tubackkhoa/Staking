const chai = require("chai");
const { ethers, network } = require("hardhat");
const { solidity } = require("ethereum-waffle");

const { expect } = chai;
chai.use(solidity);

const DECIMALS = ethers.BigNumber.from(10).pow(18);
const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'; // ethers.utils.keccak256('MINTER_ROLE');
let TOKEN, INTERNAL_TOKEN_LOCK;
let AdvisorWallet, EcoSystemWallet, TeamWallet, LiqWallet;

describe('InternalTokenLock', () => {

  beforeEach(async () => {
    [AdvisorWallet, EcoSystemWallet, TeamWallet, LiqWallet] = await ethers.getSigners();

    const DNFT = await ethers.getContractFactory('DNFT');

    const token = await upgrades.deployProxy(DNFT, { initializer: "init" });
    await token.deployed();

    const TokenLock = await ethers.getContractFactory('InternalTokenLock');
    const tokenLock = await upgrades.deployProxy(
      TokenLock,
      [
        token.address,
        AdvisorWallet.address,
        EcoSystemWallet.address,
        TeamWallet.address,
        LiqWallet.address
      ],
    );

    await tokenLock.deployed();
    await token.grantRole(MINTER_ROLE, tokenLock.address);

    TOKEN = token;
    INTERNAL_TOKEN_LOCK = tokenLock;
  });

  it('claims to early', async () => {
    try {
      await INTERNAL_TOKEN_LOCK.claims();
    } catch (e) {
      expect(e.message).to.be.contains('please start to claims');
    }
  });

  it('start and claims', async () => {
    await INTERNAL_TOKEN_LOCK.start();
    expect(await INTERNAL_TOKEN_LOCK.startTime()).to.be.gt(ethers.BigNumber.from(0));
    await expect(INTERNAL_TOKEN_LOCK.claims()).to.be.revertedWith('claims to early');
  });

  it('start claim times', async () => {
    const beforeOfLiq = await TOKEN.balanceOf(LiqWallet.address);
    const beforeOfAdv = await TOKEN.balanceOf(AdvisorWallet.address);
    const beforeOfTeam = await TOKEN.balanceOf(TeamWallet.address);
    const beforeOfEco = await TOKEN.balanceOf(EcoSystemWallet.address);

    await INTERNAL_TOKEN_LOCK.start();

    const TOTAL_LIQ = await INTERNAL_TOKEN_LOCK.LIQ();

    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), 'prelock liq').to.be.eq(await INTERNAL_TOKEN_LOCK.LIQ_PRE());
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked()).to.be.eq(ethers.BigNumber.from(0));
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked()).to.be.eq(ethers.BigNumber.from(0));
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(ethers.BigNumber.from(0));

    // 10d, too early
    await network.provider.send("evm_increaseTime", [86400 * 10]);
    await expect(INTERNAL_TOKEN_LOCK.claims()).to.be.revertedWith("claims to early");

    await network.provider.send("evm_increaseTime", [86400 * 20]);
    await INTERNAL_TOKEN_LOCK.claims();

    const ECO_TOKEN_PER_TRANCHE = await INTERNAL_TOKEN_LOCK.ECO_TOKEN_PER_TRANCHE();

    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), "Full unlocking after 1 month").to.be.eq(TOTAL_LIQ);
    const firstUnlockEco = ECO_TOKEN_PER_TRANCHE;
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked(), "First unlock").to.be.eq(firstUnlockEco);
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked()).to.be.eq(ethers.BigNumber.from(0).mul(DECIMALS));
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(ethers.BigNumber.from(0).mul(DECIMALS));

    const ADVISOR_TOKEN_PER_TRANCHE = await INTERNAL_TOKEN_LOCK.ADV_TOKEN_PER_TRANCHE();

    // 2 days
    await network.provider.send("evm_increaseTime", [86400 * 2]);
    await INTERNAL_TOKEN_LOCK.claims();
    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), "Full unlocking after 1 month").to.be.eq(TOTAL_LIQ);

    const secondUnlockEco = ECO_TOKEN_PER_TRANCHE.mul(2);
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked(), "after 2 days").to.be.eq(firstUnlockEco.add(secondUnlockEco));
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked()).to.be.eq(ethers.BigNumber.from(0).mul(DECIMALS));
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(ethers.BigNumber.from(0).mul(DECIMALS));

    // 5 months
    await network.provider.send("evm_increaseTime", [86400 * 30 * 5]);
    await INTERNAL_TOKEN_LOCK.claims();
    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), "Full unlocking after 1 month").to.be.eq(TOTAL_LIQ);

    const thirdUnlockEco = ECO_TOKEN_PER_TRANCHE.mul(5 * 30);
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked(), "add 5 months").to.be.eq(firstUnlockEco.add(secondUnlockEco).add(thirdUnlockEco));

    const firstUnlockAdv = ADVISOR_TOKEN_PER_TRANCHE.mul(3);
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked(), "6 month cliff & 3 days").to.be.eq(firstUnlockAdv);
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(0);

    // 5 months (11 months from begining)
    await network.provider.send("evm_increaseTime", [86400 * 30 * 5]);
    await INTERNAL_TOKEN_LOCK.claims();
    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), "Full unlocking after 1 month").to.be.eq(TOTAL_LIQ);

    const fourthUnlockEco = ECO_TOKEN_PER_TRANCHE.mul(5 * 30);
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked(), "add 5 months").to.be.eq(firstUnlockEco.add(secondUnlockEco).add(thirdUnlockEco).add(fourthUnlockEco));

    const secondUnlockAdv = ADVISOR_TOKEN_PER_TRANCHE.mul(5 * 30);
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked(), "6 month cliff & 3 days + 5 month").to.be.eq(firstUnlockAdv.add(secondUnlockAdv));
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(0);

    // 2 months
    await network.provider.send("evm_increaseTime", [86400 * 30 * 2]);
    await INTERNAL_TOKEN_LOCK.claims();
    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked(), "Full unlocking after 1 month").to.be.eq(TOTAL_LIQ);

    const fifthUnlockEco = ECO_TOKEN_PER_TRANCHE.mul(2 * 30);
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked(), "add 5 months").to.be.eq(firstUnlockEco.add(secondUnlockEco).add(thirdUnlockEco).add(fourthUnlockEco).add(fifthUnlockEco));

    const thirdUnlockAdv = ADVISOR_TOKEN_PER_TRANCHE.mul(2 * 30);
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked(), "6 month cliff & 3 days + 5 month + 2 month").to.be.eq(firstUnlockAdv.add(secondUnlockAdv).add(thirdUnlockAdv));

    // 392 day from begining -> 32 days
    const TEAM_TOKEN_PER_TRANCHE = await INTERNAL_TOKEN_LOCK.TEAM_TOKEN_PER_TRANCHE();
    const firstUnlockTeam = TEAM_TOKEN_PER_TRANCHE.mul(33);
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked(), "First unlock of team").to.be.eq(firstUnlockTeam);

    // after  5 years, full unlock
    await network.provider.send("evm_increaseTime", [86400 * 30 * 12 * 5]);
    await INTERNAL_TOKEN_LOCK.claims();
    expect(await INTERNAL_TOKEN_LOCK.liquidityUnlocked()).to.be.eq(TOTAL_LIQ);
    expect(await INTERNAL_TOKEN_LOCK.ecoSystemUnlocked()).to.be.eq(await INTERNAL_TOKEN_LOCK.ECOSYSTEM());
    expect(await INTERNAL_TOKEN_LOCK.advisorUnlocked()).to.be.eq(await INTERNAL_TOKEN_LOCK.ADVISOR());
    expect(await INTERNAL_TOKEN_LOCK.teamUnlocked()).to.be.eq(await INTERNAL_TOKEN_LOCK.TEAM());

    const afterOfLiq = await TOKEN.balanceOf(LiqWallet.address);
    const afterOfAdv = await TOKEN.balanceOf(AdvisorWallet.address);
    const afterOfTeam = await TOKEN.balanceOf(TeamWallet.address);
    const afterOfEco = await TOKEN.balanceOf(EcoSystemWallet.address);

    expect(afterOfLiq.sub(beforeOfLiq)).to.be.eq(await INTERNAL_TOKEN_LOCK.LIQ());
    expect(afterOfAdv.sub(beforeOfAdv)).to.be.eq(await INTERNAL_TOKEN_LOCK.ADVISOR());
    expect(afterOfTeam.sub(beforeOfTeam)).to.be.eq(await INTERNAL_TOKEN_LOCK.TEAM());
    expect(afterOfEco.sub(beforeOfEco)).to.be.eq(await INTERNAL_TOKEN_LOCK.ECOSYSTEM());
  });
});