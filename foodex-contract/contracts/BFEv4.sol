//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
import "./ERC20MYN.sol";

contract BFEv4 {
    enum Type {
        Buyer,
        Seller,
        DeliveryPerson
    }
    struct User {
        uint256 id;
        string name;
        Type userType;
        bool reg;
    }

    uint256 public balance;
    uint256 uid;
    mapping(address => User) public users;
    address owner;
    ERC20MYN public swd;

    event UserRegistered(uint256 bid, string bname, Type userType);
    event UserUnregistered(uint256 bid, string bname, Type userType);
    event FoodBought(address buyer, uint256 hashOfOrder);
    
    constructor(address tAdd) public {
        owner = msg.sender;
        swd = ERC20MYN(tAdd);
        //swd.approve(owner, address(this), swd.totalSupply());
    }

    modifier onlyBuyer() {
        require(
            users[msg.sender].reg && users[msg.sender].userType == Type.Buyer,
            "Not a buyer"
        );
        _;
    }

    modifier validUserType(Type userType) {
        require(userType <= Type.DeliveryPerson);
        _;
    }

    function SwdBalance() public view returns (uint256) {
        return swd.balanceOf(msg.sender);
    }

    function UserReg(string memory name, Type userType)
        public
        validUserType(userType)
    {
        require(bytes(name).length > 0, "Name cannot be empty");
        uid++;
        swd.transferFrom(owner, msg.sender, 20 * 10**18);
        users[msg.sender] = User(uid, name, userType, true);
        // swd.approve(msg.sender, address(this), swd.totalSupply());
        emit UserRegistered(uid, name, userType);
    }

    function UserUnreg() public {
        User memory user = users[msg.sender];
        require(user.reg);
        swd.transferFrom(msg.sender, owner, swd.balanceOf(msg.sender));
        user.reg = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
    }

    function Order(uint256 hashOfOrder, uint256 numTokens)
        public
        payable
        onlyBuyer
    {
        // balance = address(this).balance;
        balance = swd.balanceOf(address(this));
        swd.transferFrom(msg.sender, address(this), numTokens);
        emit FoodBought(msg.sender, hashOfOrder);
    }

    function SettlePayment(bytes32[] memory sellersamount) public {
        for (uint256 i = 0; i < sellersamount.length; i++) {
            address payable seller = payable(
                address(uint160(uint256(sellersamount[i] >> 96)))
            );
            uint256 amount = uint256(uint96(uint256(sellersamount[i])));
            // seller.transfer(amount);
            swd.transfer(seller, amount);
        }
        balance = swd.balanceOf(address(this));
    }

    
}
