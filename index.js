//AJBANK

let express= require('express')

let app=express() 

app.set('view engine','ejs')

app.use(express.static(__dirname+"/public/")); 

const bodyParser = require('body-parser'); 
const res = require("express/lib/response")
const urlencodedParser = bodyParser.urlencoded({extended: false}) 


const {MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://0.0.0.0:27017");

app.get("",(req,res)=>{
    res.render("home.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/account",(req,res)=>{
    res.render("account.ejs")
})

app.get("/withdraw",(req,res)=>{
    res.render("withdraw.ejs")
})

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.get("/nav",(req,res)=>{
    res.render("nav.ejs")
})

app.get("/deposit",(req,res)=>{
    res.render("deposit.ejs")
})

app.get("/balance",(req,res)=>{
    res.render("balance.ejs")
})

app.get("/showbalance",(req,res)=>{
    res.render("showbal.ejs")
})

app.post("/create",urlencodedParser,async(req,res)=>{
    let con = await client.connect();
    let db= con.db('AJbank')
    let user = db.collection("user")
    user.insertOne(req.body).then((result)=> {
        res.send("<script> alert('NEW USER CREATED'); location='/account'; </script>")
    })
})


app.post("/loginform", urlencodedParser, async(req,res)=>{
    let con = await client.connect()
    let db= con.db('AJbank')
    let user = db.collection("user")
    
    let logindata = await user.find({pass:req.body.pass, user:req.body.user}).toArray();
    
    if(logindata.length>0){
        res.send("<script> alert('LOGGED IN'); location='/nav; </script>")
    }
    else{
        res.send("<script>alert('invalid user!'); location= '/';</script>")
    }
})

app.post("/acc", urlencodedParser, async(req,res)=>{
    let con= await client.connect()
    let db= con.db('AJbank')
    let user = db.collection("account")
    user.insertOne(req.body).then((result)=>{

        res.send("<script> alert('Account created');location= '/nav'; </script>")
    })
})

app.post("/depositAmt", urlencodedParser, async(req,res)=>{
    let con = await client.connect()
    let db = con.db("AJbank")
    let user = db.collection("account")
    let userData = await user.findOne({accNo:req.body.accNo})
    console.log(userData)
    let balance = userData.balance;
    let newBalance = eval(balance)+ eval(req.body.deposit);
    user.updateOne({accNo: req.body.accNo},{$set:{balance:newBalance}}).then (async(result)=>{
        let showData = await user.findOne({accNo:req.body.accNo})
        res.render("showbal",{"i":showData})
    })

})

app.post("/withdrawAmt", urlencodedParser, async(req,res)=>{
    let con = await client.connect()
    let db = con.db("AJbank")
    let user = db.collection("account")
    let userData = await user.findOne({accNo:req.body.accNo})
    console.log(userData)
    let balance = userData.balance;
    let newBalance = eval(balance)+ eval(req.body.withdraw);
    user.updateOne({accNo: req.body.accNo},{$set:{balance:newBalance}}).then (async(result)=>{
        let showData = await user.findOne({accNo:req.body.accNo})
        res.render("showbal",{"i":showData})
    })

})

app.post("/balance",urlencodedParser, async(req,res)=>{
    let con = await client.connect()
    let db = con.db("AJbank")
    let user = db.collection("account")
    let showData = await user.findOne({accNo:req.body.accNo})
        res.render("showbal",{"i":showData})
})
app.listen(1000,()=>{
    console.log("1000 running")
})