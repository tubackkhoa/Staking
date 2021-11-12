// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract DNFT is ERC20PresetMinterPauserUpgradeable {
  using AddressUpgradeable for address;
  using SafeMathUpgradeable for uint256;

  function init() public virtual initializer {
    _totalMinted = 0;

    __ERC20PresetMinterPauser_init("DareNFT", "DNFT");
  }

  uint256 internal _totalMinted;
  uint256 constant TOTAL_SUPPLY = 100 * 10 ** 27; // 100 000 000 000

  function totalMinted() public view returns(uint256) {
    return _totalMinted;
  }

  /**
   * @dev Creates `amount` new tokens for `to`.
   *
   * See {ERC20-_mint}.
   *
   * Requirements:
   *
   * - the caller must have the `MINTER_ROLE`.
   */
  function mint(address to, uint256 amount) public override(ERC20PresetMinterPauserUpgradeable) {
    require(TOTAL_SUPPLY - _totalMinted >= amount, "DNFT: Reach total supply");
    ERC20PresetMinterPauserUpgradeable.mint(to, amount);
    _totalMinted = _totalMinted.add(amount);
  }
}
