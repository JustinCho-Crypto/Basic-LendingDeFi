import { parseUnits } from "ethers";
import { ethers } from "hardhat";

async function main() {
    const [deployer, receiver] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    console.log("Deploying Token...");
    const token = await Token.deploy(parseUnits("1000", 18));

    console.log("Token deploy address: ", await token.getAddress());   

    const tx = await token.transfer(receiver.address, parseUnits("100", 18));
    await tx.wait();

    console.log("Token transferrerring..");
    
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer balance:", deployerBalance.toString());

    const receiverBalance = await token.balanceOf(receiver.address);
    console.log("Receiver balance:", receiverBalance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

