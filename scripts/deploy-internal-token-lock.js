

const H = require("hardhat");

const { ethers } = H;

async function deploy() {
  const DNFT = await ethers.getContractFactory("DNFT");
  const token = await DNFT.attach(process.env.DNFT_ADDRESS);

  const MINTER_ROLE = await token.MINTER_ROLE();

  const { ADVISOR, ECOSYSTEM, TEAM, LIQ } = process.env;

  const TokenLock = await ethers.getContractFactory('InternalTokenLock');
  const tokenLock = await upgrades.deployProxy(
    TokenLock,
    [
      token.address,
      ADVISOR,
      ECOSYSTEM,
      TEAM,
      LIQ
    ],
  );

  await tokenLock.deployed();
  await token.grantRole(MINTER_ROLE, tokenLock.address);

  console.log('Internal token lock:', tokenLock.address);
}


deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
