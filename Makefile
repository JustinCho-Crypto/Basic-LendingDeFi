.PHONY: node 0 1 2 3 4 5

node:
	npx hardhat node	

0:
	npx hardhat run test/0_deploy.ts --network localhost

1:
	npx hardhat run test/1_transfer.ts --network localhost

2:
	npx hardhat run test/2_checkBalance.ts --network localhost

3:
	npx hardhat run test/3_approve.ts --network localhost

4:
	npx hardhat run test/4_mintAndBurn.ts --network localhost	

5:
	npx hardhat run test/5_Event.ts --network localhost



