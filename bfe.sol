//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
contract BFEv4 {
    
    enum Type {Buyer, Seller, DeliveryPerson}
    struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
        // uint amount;
    }

    uint public balance;
    uint uid;
    uint mid;
    mapping(address => User) public users;

    event UserRegistered(uint bid, string bname, Type userType);
    event UserUnregistered(uint bid, string bname, Type userType);

    modifier onlySeller(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Seller, "Not a seller");
        _;
    }

    modifier onlyBuyer(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Buyer, "Not a buyer");
        _;
    }

    modifier onlyDeliveryPerson{
        require(users[msg.sender].reg && users[msg.sender].userType == Type.DeliveryPerson, "Not a delivery person");
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
        // (msg.sender).transfer(user.amount);
        // user.amount = 0;
        user.reg = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
    }


    // function Buy(address[] memory sellers, uint[] memory money) public payable onlyBuyer{
    //     require(sellers.length == money.length, "Sellers and money doesn't match length");
    //     for (uint i = 0; i < sellers.length; i ++)
    //         users[sellers[i]].amount += money[i];
    //     balance = address(this).balance;
    // }

    function Buy(bytes32[] memory sellersamount) public payable onlyBuyer{
        for (uint i = 0; i < sellersamount.length; i ++){
            address payable seller = address(uint160(uint256(sellersamount[i] >> 96)));
            uint amount = uint(uint96(uint256(sellersamount[i])));
            seller.transfer(amount);
        }
        balance = address(this).balance;
    }

    // function withdraw() public payable{
    //     require(users[msg.sender].amount <= 0, "Insufficient funds");
    //     address payable user = msg.sender;
    //     user.transfer(users[user].amount);
    //     users[user].amount = 0;
    // }
}
