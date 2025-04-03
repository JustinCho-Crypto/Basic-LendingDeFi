import "dotenv/config";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

//정수로 출력하기 : ethers.formatUnits(value, decimals) -> ethers.formatUnits(value, 18)
async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS as string;
    const [deployer, receiver] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("Token");
    const token = await MyToken.attach(tokenAddress) as any;

    const initialSupply = await token.totalSupply();
    console.log("Initial supply:", initialSupply.toString());

    const mintAmount = parseUnits("1000", 18);
    console.log("Minting 100 tokens to deployer...");
    const mintTx = await token.mint(deployer.address, mintAmount);
    await mintTx.wait();

    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer balance after minting:", deployerBalance.toString());
    const supplyAfterMint = await token.totalSupply();
    console.log("Supply after minting:", supplyAfterMint.toString());

    const burnAmount = parseUnits("50", 18);
    const tokenAsReceiver = token.connect(receiver);
    console.log("Burning 50 tokens...");
    const burnTx = await token.burn(burnAmount);
    await burnTx.wait();

    const supplyAfterBurn = await token.totalSupply();
    console.log("Supply after burning:", supplyAfterBurn.toString());   

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });     