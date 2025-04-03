import "dotenv/config";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS as string;
    const [deployer, receiver] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("Token");
    const token = await MyToken.attach(tokenAddress) as any;
    
    token.on("Transfer", async (from:string, to:string, value: any, event: any) => {
        console.log("Transfer event detected");
        console.log("From:", from);
        console.log("To:", to);
        console.log("Value:", value);
        console.log("From balance:", (await token.balanceOf(from)).toString());
        console.log("To balance:", (await token.balanceOf(to)).toString());
    });

    console.log("Waiting for event logs..");
    setTimeout(() => {
        console.log("hi, i'm here");
        token.removeAllListeners("Transfer");
        console.log("Done listening. Exiting.");
        process.exit(0)
    }, 20000);

}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });