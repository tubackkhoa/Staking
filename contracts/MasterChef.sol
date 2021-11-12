// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

// MasterChef is the master of DNFT. He can make DNFT and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once DNFT is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using SafeMath for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 lastDepositTimestamp; // Deposit timestamp

        // We do some fancy math here. Basically, any point in time, the amount of DNFTs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accDnftPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accDnftPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20Upgradeable lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. DNFTs to distribute per block.
        uint256 lastRewardBlock; // Last block number that DNFTs distribution occurs.
        uint256 accDnftPerShare; // Accumulated DNFTs per share, times 1e12. See below.
    }

    // The DNFT TOKEN!
    IERC20Upgradeable public dnft;
    // Dev address.
    address public devaddr;
    // Cake tokens created per block.
    uint256 public dnftPerBlock;
    // Bonus muliplier for early dnft makers.
    uint256 public BONUS_MULTIPLIER;
    // Lock time
    uint256 public lockTime;
    address public minter;
    uint256 public totalStakedDnft;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint;
    // The block number when CAKE mining starts.
    uint256 public startBlock;

    event Deposit(
        address indexed user,
        uint256 indexed pid,
        uint256 amount,
        uint256 timestamp
    );
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    function initialize(
        address _dnft,
        address _devaddr,
        uint256 _dnftPerBlock,
        uint256 _startBlock
    ) external initializer {
        __Ownable_init();

        dnft = IERC20Upgradeable(_dnft);
        devaddr = _devaddr;
        dnftPerBlock = _dnftPerBlock;
        startBlock = _startBlock;

        // fair bonus
        BONUS_MULTIPLIER = 1;
        lockTime = 0 days;
        totalAllocPoint = 0;
        minter = owner();

        poolInfo.push(
            PoolInfo({
                lpToken: IERC20Upgradeable(_dnft),
                allocPoint: 1000,
                lastRewardBlock: _startBlock,
                accDnftPerShare: 0
            })
        );
        totalAllocPoint = 1000;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(
        uint256 _allocPoint,
        IERC20Upgradeable _lpToken,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accDnftPerShare: 0
            })
        );
    }

    // Update the given pool's DNFT allocation point. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        if (prevAllocPoint != _allocPoint) {
            totalAllocPoint = totalAllocPoint.sub(prevAllocPoint).add(
                _allocPoint
            );
        }
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to)
        public
        view
        returns (uint256)
    {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    // View function to see pending DNFTs on frontend.
    function pendingDnft(uint256 _pid, address _user)
        external
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accDnftPerShare = pool.accDnftPerShare;
        uint256 lpSupply = _pid == 0
            ? totalStakedDnft
            : pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardBlock,
                block.number
            );

            // percentage of the pool mul with multiplier
            uint256 dnftReward = multiplier
                .mul(dnftPerBlock)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);

            accDnftPerShare = accDnftPerShare.add(
                dnftReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accDnftPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = _pid == 0
            ? totalStakedDnft
            : pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 dnftReward = multiplier
            .mul(dnftPerBlock)
            .mul(pool.allocPoint)
            .div(totalAllocPoint);
        // send reward
        dnft.safeTransferFrom(minter, address(this), dnftReward);
        pool.accDnftPerShare = pool.accDnftPerShare.add(
            dnftReward.mul(1e12).div(lpSupply)
        );
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for DNFT allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.accDnftPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                safeDnftTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            if (_pid == 0) {
                totalStakedDnft = totalStakedDnft.add(_amount);
            }
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accDnftPerShare).div(1e12);
        user.lastDepositTimestamp = block.timestamp;

        emit Deposit(msg.sender, _pid, _amount, user.lastDepositTimestamp);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(
            user.lastDepositTimestamp.add(lockTime) <= block.timestamp,
            "withdraw: withdrawal is only available after lock time"
        );
        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accDnftPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            safeDnftTransfer(msg.sender, pending);
        }
        if (_amount > 0) {
            if (_pid == 0) {
                totalStakedDnft = totalStakedDnft.sub(_amount);
            }
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accDnftPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        if (_pid == 0) {
            totalStakedDnft = totalStakedDnft.sub(user.amount);
        }
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe DNFT transfer function, just in case if rounding error causes pool to not have enough DNFTs.
    function safeDnftTransfer(address _to, uint256 _amount) internal {
        uint256 dnftBal = dnft.balanceOf(address(this));
        if (_amount > dnftBal) {
            dnft.transfer(_to, dnftBal);
        } else {
            dnft.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }

    // Update dnftPerBlock
    function setDnftPerBlock(uint256 _dnftPerBlock) external onlyOwner {
        require(
            _dnftPerBlock > 0,
            "setDnftPerBlock: amount must be greater than 1 wei"
        );

        dnftPerBlock = _dnftPerBlock;
    }

    // Set locktime
    function setLockTime(uint256 _lockTime) external onlyOwner {
        lockTime = _lockTime;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }
}
