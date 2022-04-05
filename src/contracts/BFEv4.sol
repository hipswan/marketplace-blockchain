//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <=0.9.0;
contract BFEv4 {
    
    enum Type {Buyer, Seller, DeliveryPerson}
    struct User{
        uint id;
        string name;
        Type userType;
        bool reg;
        bool available;
    }

    struct FoodItem{
        uint fid;
        address payable seller;
        string fname;
        uint price;
        uint qty;
    }

    uint public balance;
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

    modifier onlyDeliveryPerson{
        require(users[msg.sender].reg && users[msg.sender].userType == Type.DeliveryPerson, "Not a delivery person");
        _;
    }

    modifier validUserType(Type userType){
        require(userType <= Type.DeliveryPerson);
        _;
    }

    constructor() public{
        balance = address(this).balance;
    }

    function UserReg(string memory name, Type userType) public validUserType(userType){
        require(bytes(name).length > 0, "Name cannot be empty");
        uid ++;
        users[msg.sender] = User(uid, name, userType, true, true);
        emit UserRegistered(uid, name, userType);
    }

    function UserUnreg() public{
        User memory user = users[msg.sender];
        require(user.reg);
        user.reg = false;
        user.available = false;
        users[msg.sender] = user;
        emit UserUnregistered(user.id, user.name, user.userType);
    }

    function DelvPersonAvail() public onlyDeliveryPerson{
        require(!users[msg.sender].available);
        users[msg.sender].available = true;
    }

    function FoodItemReg(string memory name, uint price, uint qty) public onlySeller{
        require(bytes(name).length > 0, "Name cannot be empty");
        require(price > 0, "Item price cannot be 0");
        require(qty > 0, "Item count cannot be 0");
        mid ++;
        menu[mid] = FoodItem(mid, payable(msg.sender), name, price, qty);
        emit FoodItemAdded(mid, payable(msg.sender), name, price, qty);
    }

    function FoodItemUpdate(uint id, uint price, uint qty) public onlySeller{
        require(id <= mid, "Item does not exists");
        FoodItem memory item = menu[id];
        require(item.seller == msg.sender, "Not the authorized seller");
        item.qty = qty;
        item.price = price;
        menu[id] = item;
        emit FoodItemAdded(id, payable(msg.sender), item.fname, price, qty);
    }

    function Buy(uint id, uint count, bool delv,uint delvCost, address payable delvperson) public payable onlyBuyer{
        require(id <= mid, "Item does not exists");
        require(count > 0, "Item count cannot be 0");
        require(!delv || (users[delvperson].reg && users[delvperson].available), "Delivery person is not available or registered");
        FoodItem memory item = menu[id];
        require(count <= item.qty, "Requirement not met");
        require(item.qty > 0, "Item Unavailable");
        uint itemCost = item.price * count * 1 wei;
        // uint delvCost = 1 ether * 1 wei;
        // require(msg.value == itemCost, "Please send proper money");
        address payable seller = item.seller;
        seller.transfer(itemCost);
        // payable(this).transfer(1 ether);
        if (delv){
            delvperson.transfer(delvCost);
            users[delvperson].available = false;
        }
        balance = address(this).balance;
        item.qty -= count;
        menu[id] = item;
        emit FoodItemBought(id, msg.sender, seller, item.fname, count);
    }
}
