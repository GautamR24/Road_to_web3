// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");



//returns the ether balance of an address

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Logs the ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  console.log(addresses[0]);
  for (const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

//Logs the memos stored on-chain form coffee purchase

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}.${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {

  // get the example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buymeacoffee = await BuyMeACoffee.deploy();
  await buymeacoffee.deployed();
  console.log("BuyMeACoffee deployed to", buymeacoffee.address);

  // Check the balance before coffee purchase
  const addresses = [owner.address, tipper.address, buymeacoffee.address];
  console.log("==start==");
  await printBalances(addresses);

  // Buy the owner few coffee
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buymeacoffee.connect(tipper).BuyCoffee("name1", "You are the best", tip);//connecting to the deployed contract using the tipper address
  await buymeacoffee.connect(tipper2).BuyCoffee("name2", "You are the best2", tip);//tip is the transaction object which says that this much valus is transferred while calling this funtion.
  await buymeacoffee.connect(tipper3).BuyCoffee("name1", "You are the best3", tip);

  // Check balance after the buying the coffee
  console.log("==Bought the coffee==");
  await printBalances(addresses);

  // Withdraw funds
  await buymeacoffee.connect(owner).WithdrawTips();

  // Check balance after withdraw
  console.log("==After withdrawing the tips==");
  await printBalances(addresses);

  // Read all the memos left for the owner
  console.log("memos")
  const memos = await buymeacoffee.getMemos();
  printMemos(memos);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
