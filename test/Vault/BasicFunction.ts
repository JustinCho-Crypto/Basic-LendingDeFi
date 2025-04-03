import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
    const vaultAddress = process.env.VAULT_ADDRESS as string;
    const [user] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.attach(vaultAddress) as any;

    const balance = await vault.balances(user.address);
    console.log("User Balance:", balance.toString());

    console.log("Depositing 1 ETH...");
    const depositAmount = ethers.parseEther("1");
    const depositTx = await vault.deposit(depositAmount, { value: depositAmount });
    await depositTx.wait();

    const newBalance = await vault.balances(user.address);
    console.log("New Balance:", newBalance.toString());

    console.log("Withdrawing 0.5 ETH...");
    const withdrawAmount = ethers.parseEther("0.5");
    const withdrawTx = await vault.withdraw(withdrawAmount);
    await withdrawTx.wait();

    const finalBalance = await vault.balances(user.address);
    console.log("Final Balance:", finalBalance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });