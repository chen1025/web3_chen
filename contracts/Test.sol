/*
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 募集N USD的 ETH 的资金
// 转换才 N * 3 的token
// 到时间不足 N 全部自动退回
// 到时间超过 N 全部换成 token
contract BuildToken is ERC20 {

    address private owner;
    uint256 private minAmount;
    uint256 private amount;
    mapping(address => uint256) moneyMap;
    uint256 deploymentTimestamp;
    uint256 lockTime;
    AggregatorV3Interface internal dataFee;


    constructor(string memory name_, string memory token_, uint256 amount_,uint lockTime_) ERC20(name_, token_){
        owner = msg.sender;
        minAmount = amount_;
        dataFee = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        lockTime = lockTime_;
    }
    // 充钱
    function fund() public payable {
        require(block.timestamp < deploymentTimestamp + lockTime, "windows is closed");
        moneyMap[msg.sender] += msg.value;
        amount += msg.value;
    }
    // 退款
    function returnAmount() public {
        require(block.timestamp > deploymentTimestamp + lockTime, "time is coming...");
        require(amount < minAmount, "money is enough");
        uint256 _amount = moneyMap[msg.sender];
        require(_amount > 0, "amount is zero");
        payable(msg.sender).call{value : _amount}("");
    }

    // 兑换
    function change() public{
        require(block.timestamp > deploymentTimestamp + lockTime, "time is coming...");
        require(amount > minAmount, "money is not enough");
        uint256 _amount = moneyMap[msg.sender];
        require(_amount > 0, "amount is zero");
        uint256 usd_ = ethToUsd(_amount);
        // 铸造
        _mint(msg.sender,usd_ * 3);
    }

    // ETH 转换 USDT
    function ethToUsd(uint256 amount_) public view returns (uint256){
        uint256 price = uint256(getChainLinkLastPrice());
        return amount_ * price / (10 ** 8);
    }

    // ETH 转换 USDT
    function balanceOfEth() public view returns (uint256){
        return amount;
    }

    function getChainLinkLastPrice() public view returns (int){
        // prettier-ignore
        (
        */
/* uint80 roundID *//*
,
        int answer,
        */
/*uint startedAt*//*
,
        */
/*uint timeStamp*//*
,
        */
/*uint80 answeredInRound*//*

        ) = dataFee.latestRoundData();
        return answer;
    }


}
*/
