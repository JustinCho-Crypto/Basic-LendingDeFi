import "dotenv/config";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS as string;
    const [deployer, receiver, address3] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("Token");
    const token = MyToken.attach(tokenAddress);

    console.log("deployer balance:", (await token.balanceOf(deployer.address)).toString());
    console.log("receiver balance:", (await token.balanceOf(receiver.address)).toString());
    console.log("address3 balance:", (await token.balanceOf(address3.address)).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });