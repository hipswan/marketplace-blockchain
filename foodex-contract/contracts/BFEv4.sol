//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
contract BFEv4 {
    
    enum Type {Buyer, Seller, DeliveryPerson}
    struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
    }

    uint public balance;
    uint uid;
    mapping(address => User) public users;

    event UserRegistered(uint bid, string bname, Type userType);
    event UserUnregistered(uint bid, string bname, Type userType);
    event FoodBought(address buyer, uint hashOfOrder);


    modifier onlyBuyer(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Buyer, "Not a buyer");
        _;
    }


    modifier validUserType(Type userType){
        require(userType <= Type.DeliveryPerson);
        _;
    }

    function UserReg(string memory name, Type userType) public validUserType(userType){
        require(bytes(name).length > 0, "Name cannot be empty");
        uid ++;
        users[msg.sender] = User(uid, name, userType, true);
        emit UserRegistered(uid, name, userType);
    }

    function UserUnreg() public{
        User memory user = users[msg.sender];
        require(user.reg);
        user.reg = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
    }


    function Order(uint hashOfOrder) public payable onlyBuyer{
        balance = address(this).balance;
        emit FoodBought(msg.sender, hashOfOrder);
    }

    function SettlePayment(bytes32[] memory sellersamount) public payable{
        for (uint i = 0; i < sellersamount.length; i ++){
            address payable seller = payable(address(uint160(uint256(sellersamount[i] >> 96))));
            uint amount = uint(uint96(uint256(sellersamount[i])));
            seller.transfer(amount);
        }
        balance = address(this).balance;
    }

  
}
