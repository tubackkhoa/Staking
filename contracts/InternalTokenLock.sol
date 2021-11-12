// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import './DNFT.sol';

// lock eco / advisor / team ...
contract InternalTokenLock is Initializable {

  using SafeMath for uint256;

  DNFT internal _token;

  function token() public view returns(address) {
    return address(_token);
  }

  address internal _owner;

  function initialize(
    DNFT token_,

    address advisorWallet_,
    address ecoSystemWallet_,
    address teamWallet_,
    address liqWallet_
  ) public initializer {
    _token = token_;

    _advisorWallet = advisorWallet_;
    _ecoSystemWallet = ecoSystemWallet_;
    _teamWallet = teamWallet_;
    _liqWallet = liqWallet_;

    _owner = msg.sender;

    _advisorUnlocked = 0;
    _ecoSystemUnlocked = 0;
    _teamUnlocked = 0;
    _liqUnlocked = 0;

    _startTime = 0;
  }

  uint internal _startTime;
  function startTime() public view returns(uint) {
    return _startTime;
  }

  function start() public {
    require(_startTime == 0);
    require(_owner == msg.sender);

    _startTime = block.timestamp;

    // pre unlock liq 5%
    _liqUnlocked = LIQ_PRE;
    _token.mint(_liqWallet, _liqUnlocked);
    emit OnLiquidity(block.timestamp, _liqUnlocked);
  }

  uint256 constant public DECIMALS = 10 ** 18;
  uint256 constant public ADVISOR = 12000000000 * DECIMALS; // 12%
  uint256 constant public ECOSYSTEM = 36500000000 * DECIMALS; // 36.5%
  uint256 constant public TEAM = 22000000000 * DECIMALS; // 22%
  uint256 constant public LIQ = 10000000000 * DECIMALS; // 10%

  uint256 constant public LIQ_PRE = 500000000 * DECIMALS; // 5% of LIQ

  uint256 constant public ECO_TOKEN_PER_TRANCHE = 50000000 * DECIMALS; // / (24 month)
  uint256 constant public ADV_TOKEN_PER_TRANCHE = 33333334 * DECIMALS; // / (12 month) ~ 33.333.333,333333332
  uint256 constant public TEAM_TOKEN_PER_TRANCHE = 30555556 * DECIMALS; // / (24 month) ~ 30.555.555,555555556

  uint256 internal _advisorUnlocked;
  uint256 internal _ecoSystemUnlocked;
  uint256 internal _teamUnlocked;
  uint256 internal _liqUnlocked;

  address internal _advisorWallet;
  address internal _ecoSystemWallet;
  address internal _teamWallet;
  address internal _liqWallet;

  function liquidityUnlocked() public view returns(uint256) {
    return _liqUnlocked;
  }

  function advisorUnlocked() public view returns(uint256) {
    return _advisorUnlocked;
  }

  function ecoSystemUnlocked() public view returns(uint256) {
    return _ecoSystemUnlocked;
  }

  function teamUnlocked() public view returns(uint256) {
    return _teamUnlocked;
  }

  event OnTeamClaim(uint time, uint256 amount);
  event OnEcoClaim(uint time, uint256 amount);
  event OnAdvisorClaim(uint time, uint256 amount);
  event OnLiquidity(uint time, uint256 amount);

  function claims() public returns(bool) {
    require(_startTime > 0, 'please start to claims');

    // calc unlock, per day ...
    uint256 tranche = (block.timestamp - _startTime) / 86400;

    // too soon
    require(tranche >= 30, "claims to early");

    // LIQ
    if (_liqUnlocked < LIQ) {
      uint256 remain = LIQ.sub(_liqUnlocked);
      _liqUnlocked = LIQ;
      _token.mint(_liqWallet, remain);
      emit OnLiquidity(block.timestamp, remain);
    }

    // ECO, month cliff
    if (_ecoSystemUnlocked < ECOSYSTEM) {
      uint256 totalCanUnlock = (tranche - 30 + 1) * ECO_TOKEN_PER_TRANCHE;
      uint256 remain = 0;
      if (totalCanUnlock > ECOSYSTEM) {
        remain = ECOSYSTEM - _ecoSystemUnlocked;
      } else {
        remain = totalCanUnlock - _ecoSystemUnlocked;
      }

      if (remain > 0) {
        _ecoSystemUnlocked = _ecoSystemUnlocked.add(remain);
        _token.mint(_ecoSystemWallet, remain);
        emit OnEcoClaim(block.timestamp, remain);
      }
    }

    // Advisor, 6 month cliff
    if (_advisorUnlocked < ADVISOR) {
      if (tranche >= 6 * 30) {
        uint256 totalCanUnlock = (tranche - 6 * 30 + 1) * ADV_TOKEN_PER_TRANCHE;
        uint256 remain = 0;
        if (totalCanUnlock > ADVISOR) {
          remain = ADVISOR - _advisorUnlocked;
        } else {
          remain = totalCanUnlock - _advisorUnlocked;
        }

        if (remain > 0) {
          _advisorUnlocked = _advisorUnlocked.add(remain);
          _token.mint(_advisorWallet, remain);
          emit OnAdvisorClaim(block.timestamp, remain);
        }
      }
    }

    // Team, 12 month cliff
    if (_teamUnlocked < TEAM) {
      if (tranche >= 12 * 30) {
        uint256 totalCanUnlock = (tranche - 12 * 30 + 1) * TEAM_TOKEN_PER_TRANCHE;
        uint256 remain = 0;
        if (totalCanUnlock > TEAM) {
          remain = TEAM - _teamUnlocked;
        } else {
          remain = totalCanUnlock - _teamUnlocked;
        }

        if (remain > 0) {
          _teamUnlocked = _teamUnlocked.add(remain);
          _token.mint(_teamWallet, remain);
          emit OnTeamClaim(block.timestamp, remain);
        }
      }
    }
    
    return true;
  }
}
