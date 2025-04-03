import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
    const vaultAddress = process.env.VAULT_ADDRESS as string;
    const [user] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.attach(vaultAddress) as any;

    // 초기 잔액 확인
    const initialBalance = await vault.balances(user.address);
    console.log("Initial Balance:", ethers.formatEther(initialBalance));

    // 1 ETH 입금
    console.log("Depositing 1 ETH...");
    const depositAmount = ethers.parseEther("1");
    const depositTx = await vault.deposit(depositAmount, { value: depositAmount });
    await depositTx.wait();

    // 최대 대출 가능 금액 확인
    const maxBorrowable = await vault.getMaxBorrowable(user.address);
    console.log("Max Borrowable:", ethers.formatEther(maxBorrowable));

    // 0.5 ETH 대출
    console.log("Borrowing 0.5 ETH...");
    const borrowAmount = ethers.parseEther("0.5");
    const borrowTx = await vault.borrow(borrowAmount);
    await borrowTx.wait();

    // 현재 대출 금액 확인
    const borrowed = await vault.getBorrowed(user.address);
    console.log("Current Borrowed:", ethers.formatEther(borrowed));

    // 0.3 ETH 상환
    console.log("Repaying 0.3 ETH...");
    const repayAmount = ethers.parseEther("0.3");
    const repayTx = await vault.repay({ value: repayAmount });
    await repayTx.wait();

    // 최종 대출 금액 확인
    const finalBorrowed = await vault.getBorrowed(user.address);
    console.log("Final Borrowed:", ethers.formatEther(finalBorrowed));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    }); 