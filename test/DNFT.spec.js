const { expect } = require("chai");
const { upgrades, ethers} = require('hardhat');

describe("DNFT", () => {
  const NAME = 'DareNFT';
  const SYMBOL = 'DNFT';

  beforeEach(async () => {
    const DNFT = await ethers.getContractFactory('DNFT');
    this.token = await upgrades.deployProxy(DNFT, { initializer: "init" });
  });

  describe('token attributes', () => {
    it ('has the correct name', async () => {
      const name = await this.token.name();
      expect(name).equal(NAME);
    });

    it ('has the correct symbol', async () => {
      const symbol = await this.token.symbol();
      expect(symbol).equal(SYMBOL);
    });
  });
});
