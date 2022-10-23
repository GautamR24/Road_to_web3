// SPDX-License-Identifier: UNLICENSED

//deployed to Goerli at 0x3555dF5a1b66033ea5e07D773F25ca0282C02C6c
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BuyMeACoffee {
    //Event to emit
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all the memos received from friends
    Memo[] memos;

    //Address of the contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
    *@dev using this function the original owner of the contract can change the ownership
    *@param _to address of the new owner which will be passed by the original owner
     */
    function setNewOwner(address payable _to) public{
        require(msg.sender == owner, "Only owner can set the new owner");
        owner = _to;
    }
    /**
     *@dev buy a coffer for the contract owner
     *@param _name name of the coffee buyer
     *@param _message  a nice message from the coffee owner
     */

    function BuyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "We cannot buy coffee with 0 eth");

        // Add the memo to the blockchain storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //Emit a log when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     *@dev The owner can withdraw the tips
     */
    function WithdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     *@dev  retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
