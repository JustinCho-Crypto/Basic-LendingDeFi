import "dotenv/config";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS as string;
    const [deployer, receiver, address3] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("Token");
    const token = MyToken.attach(tokenAddress);

    const amount = parseUnits("100", 18);

    //deployer가 receiver에게 approve함
    console.log("Deployer approves 100 tokens to receiver..");
    const approveTx = await token.approve(receiver.address, amount);
    await approveTx.wait();

    console.log("Tokens approved to receiver");

    const transferAmount = parseUnits("50", 18);
    console.log("Transferring 50 tokens from receiver to address3...");
    const tokenAsReceiver = token.connect(receiver);
    const transferTx = await tokenAsReceiver.transferFrom(deployer.address, address3.address, transferAmount);
    await transferTx.wait();

    console.log("Tokens transferred to address3");

    const deployerBalance = await token.balanceOf(deployer.address);
    const receiverBalance = await token.balanceOf(receiver.address);
    const address3Balance = await token.balanceOf(address3.address);

    console.log("deployer balance:", deployerBalance.toString());
    console.log("receiver balance:", receiverBalance.toString());
    console.log("address3 balance:", address3Balance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });  