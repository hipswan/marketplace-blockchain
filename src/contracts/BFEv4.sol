//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
contract BFEv4 {
    
    enum Type {Buyer, Seller}
    struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
    }

    struct FoodItem{
        uint fid;
        address payable seller;
        string fname;
        uint price;
        uint qty;
    }

    uint uid;
    uint mid;
    mapping(address => User) public users;
    mapping(uint => FoodItem) public menu;

    event UserRegistered(uint bid, string bname, Type userType);
    event UserUnregistered(uint bid, string bname, Type userType);
    event FoodItemAdded(uint fid, address payable seller, string fname, uint price, uint qty);
    event FoodItemBought(uint fid, address buyer, address payable seller, string fname, uint count);

    modifier onlySeller(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Seller, "Not a seller");
        _;
    }

    modifier onlyBuyer(){
        require(users[msg.sender].reg && users[msg.sender].userType == Type.Buyer, "Not a buyer");
        _;
    }


    modifier validUserType(Type userType){
        require(userType <= Type.Seller);
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

    function FoodItemReg(string memory name, uint price, uint qty) public onlySeller{
        require(bytes(name).length > 0, "Name cannot be empty");
        require(price > 0, "Item price cannot be 0");
        require(qty > 0, "Item count cannot be 0");
        mid ++;
        menu[mid] = FoodItem(mid, payable(msg.sender), name, price, qty);
        emit FoodItemAdded(mid, payable(msg.sender), name, price, qty);
    }

    function Buy(uint id, uint count) public payable onlyBuyer{
        require(id <= mid, "Item does not exists");
        require(count > 0, "Item count cannot be 0");
        FoodItem memory item = menu[id];
        require(count <= item.qty, "Requirement not met");
        require(item.qty > 0, "Item Unavailable");
        uint itemCost = item.price * count * 1 ether;
        require(msg.value == itemCost, "Please send proper money");
        address payable seller = item.seller;
        seller.transfer(msg.value);
        item.qty -= count;
        menu[id] = item;
        emit FoodItemBought(id, msg.sender, seller, item.fname, count);
    }
}
