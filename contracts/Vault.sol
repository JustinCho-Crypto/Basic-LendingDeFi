// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public borrowed;
    uint256 public constant MAX_LTV = 80; // 80%

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);

    function deposit(uint256 amount) public payable nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(msg.value == amount, "Deposit amount must match sent value");
        
        // 오버플로우 체크
        uint256 newBalance = balances[msg.sender] + amount;
        require(newBalance >= balances[msg.sender], "Overflow in deposit");
        
        balances[msg.sender] = newBalance;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // 출금 후에도 대출 가능한 금액이 남아있는지 확인
        uint256 remainingBalance = balances[msg.sender] - amount;
        uint256 maxBorrowable = (remainingBalance * MAX_LTV) / 100;
        require(borrowed[msg.sender] <= maxBorrowable, "Withdrawal would exceed LTV limit");

        // 상태 변경을 먼저 수행 (Checks-Effects-Interactions 패턴)
        balances[msg.sender] = remainingBalance;
        
        // 이더 전송
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }

    function borrow(uint256 amount) public nonReentrant {
        require(amount > 0, "Borrow amount must be greater than 0");
        
        // 최대 대출 가능 금액 계산
        uint256 maxBorrowable = (balances[msg.sender] * MAX_LTV) / 100;
        uint256 newBorrowed = borrowed[msg.sender] + amount;
        require(newBorrowed <= maxBorrowable, "Borrow amount exceeds LTV limit");
        require(newBorrowed >= borrowed[msg.sender], "Overflow in borrow");
        
        // 컨트랙트에 충분한 이더가 있는지 확인
        require(address(this).balance >= amount, "Insufficient contract balance");

        // 상태 변경을 먼저 수행
        borrowed[msg.sender] = newBorrowed;
        
        // 이더 전송
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Borrowed(msg.sender, amount);
    }

    function repay() public payable nonReentrant {
        require(msg.value > 0, "Repay amount must be greater than 0");
        require(borrowed[msg.sender] >= msg.value, "Repay amount exceeds borrowed amount");
        
        // 상태 변경을 먼저 수행
        borrowed[msg.sender] -= msg.value;
        
        emit Repaid(msg.sender, msg.value);
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
    
    function getBorrowed(address user) public view returns (uint256) {
        return borrowed[user];
    }
    
    function getMaxBorrowable(address user) public view returns (uint256) {
        return (balances[user] * MAX_LTV) / 100;
    }
} 