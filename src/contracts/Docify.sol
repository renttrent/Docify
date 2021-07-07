pragma solidity ^0.5.16;

// REI BALLA
// rballa18@epoka.edu.al

contract Docify {
    // STRUCTS
    // struct Multihash {
    //     bytes32 digest;
    //     uint8 hashFunction;
    //     uint8 size;
    // }

    // struct Record {
    //     bytes32 hashVerify;
    //     uint256 id;
    //     Multihash CID;
    //     address owner;
    // }
    struct Record {
        bytes32 hashVerify;
        uint256 id;
        string CID;
        address owner;
    }
    // END STRUCT

    // VARS
    mapping(uint256 => Record) records;
    uint256 nextID = 0;
    // END VARS

    // EVENTS
    event RecordEvent(
        uint256 indexed id,
        address indexed owner,
        bytes32 hashVerify
    );
    event RecordAddedSigner(
        uint256 indexed id,
        address indexed signer,
        bytes32 hashVerify
    );
    // END EVENTS

    // MODIFIERS
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    // END MODIFIERS

    // FUNCTIONS
    function issue(string memory _CID) public {
        Record memory rec;
        // Multihash memory ipfs;

        // ipfs.digest = _digest;
        // ipfs.hashFunction = _hashFunction;
        // ipfs.size = _size;

        rec.CID = _CID;
        rec.owner = msg.sender;
        rec.id = nextID;
        rec.hashVerify = keccak256(
            abi.encode(
                address(this),
                msg.sender,
                rec.CID,
                rec.id,
                block.timestamp
            )
        );

        records[rec.id] = rec;
        nextID++;

        emit RecordEvent(rec.id, msg.sender, rec.hashVerify);
    }

    function addSigner(uint256 _recordID, address _signer)
        public
        validAddress(_signer)
    {
        Record memory rec;
        rec = records[_recordID];

        rec.hashVerify = keccak256(
            abi.encode(rec.hashVerify, _signer, block.timestamp)
        );

        emit RecordAddedSigner(_recordID, _signer, rec.hashVerify);
    }
    // END FUNCTIONS
}
