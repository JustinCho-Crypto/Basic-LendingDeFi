import { ethers } from "hardhat";

async function main() {
    const VaultFactory = await ethers.getContractFactory("Vault");
    const initialSupply = ethers.parseEther("0");

    const vault = await VaultFactory.deploy();
    await vault.waitForDeployment();
    console.log("Vault deployed to :", await vault.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });