


const H = require("hardhat");
const fs = require('fs');

const MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'; // ethers.utils.keccak256(ethers.utils.formatBytes32String('MINTER_ROLE'));

const DEV = process.env.DEV || '';

let { BUSD, USDT } = process.env;

const DECIMALS = H.ethers.BigNumber.from(10).pow(18);

const { ethers } = H;

async function deploy() {
  const DNFT = await ethers.getContractFactory('DNFT');

  // const token = await H.upgrades.deployProxy(DNFT, { initializer: "init" });
  // await token.deployed();
  // console.log("DNFT deployed to:", token.address);
  const token = await DNFT.attach(process.env.DNFT_ADDRESS);

  /////
  const Sale = await ethers.getContractFactory('Sale');
  const strategy = await upgrades.deployProxy(
    Sale,
    [
      'DNFT-Strategy', 
      'DNFT-STR',
      ethers.BigNumber.from(6_000_000_000).mul(DECIMALS),
      ethers.BigNumber.from(600_000).mul(DECIMALS),
      ethers.BigNumber.from(DECIMALS).div(10 ** 4), // 0.0001
      token.address,
      ethers.BigNumber.from(5).mul(DECIMALS), // 5%
      9 * 30 * 86400, // seconds
      9 * 30 * 86400 / 86400 // tranche
    ]
  );

  // grant
  await token.grantRole(MINTER_ROLE, strategy.address);
  console.log('Strategy: ', strategy.address);

  /////
  const privateSale = await upgrades.deployProxy(
    Sale,
    [
      'DNFT-Private', 
      'DNFT-PRI',
      ethers.BigNumber.from(12_000_000_000).mul(DECIMALS),
      ethers.BigNumber.from(1_800_000).mul(DECIMALS),
      ethers.BigNumber.from(15).mul(DECIMALS).div(10 ** 5), // 0.00015
      token.address,
      ethers.BigNumber.from(10).mul(DECIMALS), // 10%
      6 * 30 * 86400, // seconds
      6 * 30 * 86400 / 86400 // tranche
    ]
  );

  await token.grantRole(MINTER_ROLE, privateSale.address);

  // ready to start
  console.log('Private: ', privateSale.address);

  console.log('config:');
  console.log(JSON.stringify({
    STRATEGY: strategy.address,
    PRIVATE: privateSale.address,
    TOKEN: token.address,
  }, null, 2));

  await strategy.start();
  await privateSale.start();
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
