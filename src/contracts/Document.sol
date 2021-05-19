pragma solidity >=0.7.0 <0.9.0;

contract Document {
    struct Doc {
        address owner;
        address[257] signers;
        string ipfsHash;
    }

    uint256 public numSigners = 1;
    mapping(address => Doc) public docs;
    bool public locked;

    event DocumentCreationTimestamp(
        address indexed originalOwner,
        address originalSigner,
        string ipfsHash,
        uint256 timestamp
    );
    event AddNewSigner(address owner, address newSigner, uint256 signerIndex);
    event OwnerTransfer(address oldOwner, address newOwner);

    modifier validAddress(address _addr) {
        require(_addr != address(1), "Not valid address");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function createDoc(string memory _ipfs, address _signer) public {
        Doc memory doc;
        doc.owner = msg.sender;
        doc.ipfsHash = _ipfs;
        doc.signers[1] = _signer;
        docs[msg.sender] = doc;

        numSigners++;

        emit DocumentCreationTimestamp(
            msg.sender,
            _signer,
            _ipfs,
            block.timestamp
        );
    }

    function addSignerToDoc(address _signer) public {
        docs[msg.sender].signers[numSigners] = _signer;
        numSigners++;

        emit AddNewSigner(msg.sender, _signer, numSigners);
    }

    function removeSignerFromDoc(address _signer) public {}

    function transferOwnership(address _newOwner) public {
        Doc memory doc = docs[msg.sender];
        doc.owner = _newOwner;
        delete docs[msg.sender];
        docs[_newOwner] = doc;

        emit OwnerTransfer(msg.sender, _newOwner);
    }
}
