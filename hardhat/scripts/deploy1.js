// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require("fs");
const hre = require("hardhat");

async function main() {
  

  const eventHub = await hre.ethers.deployContract("EventHubV1", [6655]);

  await eventHub.waitForDeployment();
  const contractAddress = await eventHub.getAddress()
  console.log(
    `deployed contract: ${contractAddress}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// contract address 0x49Fe9CcDec394Ad61aEE56b8e7eB86e8D0328f0A
