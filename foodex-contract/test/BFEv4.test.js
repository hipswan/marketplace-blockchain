// If your function can be executed as a call, then Truffle will do so and you will be able to avoid gas costs.

const BFEv4 = artifacts.require('./BFEv4.sol')
require('chai')
  .use(require('chai-as-promised'))
  .should()
contract('BFEv4', ([deployer, user, vendor]) => {
  let bfe
  before(async () => {
    bfe = await BFEv4.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      
      const address = await bfe.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    // it('has a name', async () => {
    //   const name = await marketplace.name()
    //   assert.equal(name, 'Dapp University Marketplace')
    // })
  });

describe('registeration', async () => {

    let userRegister, vendorRegister, users
    before(async ()=>{
        userRegister = await bfe.UserReg('atul singh',{from: user})
        vendorRegister = await bfe.VendorReg('yash rathi',{from:vendor})
        users = await bfe.users(user)
     })
    it('register user',async ()=>{
        console.log(web3.utils.fromWei(userRegister.logs[0].args.balance, 'Ether'))
        // console.log(users)
        assert.equal(userRegister.logs[0].args.bname, 'atul singh')
        assert.equal(userRegister.logs[0].args.user, user)

    })
    it('register vendor',async ()=>{
        // console.log(vendorRegister.logs[0].args)
        assert.equal(vendorRegister.logs[0].args.sname, 'yash rathi')
        assert.equal(vendorRegister.logs[0].args.vendor, vendor)

    })




} );

describe('list food item' , async() =>{
    let foodItem
    before(async ()=>{

        foodItem = await bfe.FoodItemReg('chicken',1,1,{from:vendor})
    })

    it('list food item', async()=>{

        // console.log(foodItem.logs[0].args)
        assert.equal(foodItem.logs[0].args.fname, 'chicken')
        assert.equal(foodItem.logs[0].args.seller, vendor)
        // assert.equal(foodItem.logs[0].args.price, web3.utils.BN(50))
        // assert.equal(foodItem.logs[0].args.count, 1)
    })



})

describe('buy food item' , async() =>{

    let buyFood,oldSellerBalance,price;
    price = web3.utils.toWei('1', 'ether')
    console.log(price)
    before(async ()=>{
      
      oldSellerBalance = await web3.eth.getBalance(vendor)

        buyFood = await bfe.Buy(1,1,{from:user,value:price})
    })
    it('buy food item', async()=>{
        
        oldSellerBalance =new web3.utils.BN(oldSellerBalance)
        let newSellerBalance
        newSellerBalance = await web3.eth.getBalance(vendor)

        newSellerBalance =new web3.utils.BN(newSellerBalance)
        
        price =new web3.utils.BN(price)
        const exepectedBalance = oldSellerBalance.add(price)
        assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

        
    })
});


});