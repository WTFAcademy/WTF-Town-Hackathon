// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TownCertificates is ERC721, Ownable{

    uint256 private _nextTokenId;
    string private baseURI; 


    constructor(string memory _name,string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {
    }
 
    // anyone can mint
    function mint() external returns(uint256 tokenId) {
        tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        
    }
 
    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function setbaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
 }