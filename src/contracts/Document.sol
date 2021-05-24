pragma solidity ^0.5.16;

contract Document {
    mapping(address => string) documents;

    function addDocument(string memory _ipfsHash) public {
        documents[msg.sender] = _ipfsHash;
    }

    function getDocument() public returns (string memory) {
        return documents[msg.sender];
    }
}
