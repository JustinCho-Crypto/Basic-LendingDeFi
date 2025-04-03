import "dotenv/config";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS as string;
    const [deployer, receiver] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("Token");
    const token = MyToken.attach(tokenAddress);

    const amount = parseUnits("100", 18);
    console.log("Transferring tokens..");

    // const tokenAsReceiver = token.connect(receiver);
    const tx = await token.transfer(receiver.address, amount);
    await tx.wait();

    const deployerBalance = await token.balanceOf(deployer.address);
    const receiverBalance = await token.balanceOf(receiver.address);

    console.log("Deployer balance:", deployerBalance.toString());
    console.log("Receiver balance:", receiverBalance.toString());   
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });