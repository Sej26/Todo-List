const express=require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

mongoose.connect("mongodb+srv://admin-sejal:Test123@cluster0.uwpxwnf.mongodb.net/todolistDB");


const app= express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const itemsSchema=  new mongoose.Schema({
    name: String
});

const Item= mongoose.model("Item", itemsSchema);


const item1=new Item({
    name:"Welcome to your To-do List"
});
const item2=new Item({
    name:"Hit the + button to add a new item"
});
const item3=new Item({
    name:"<-- Hit this to delete an item"
});

const defaultItems=[item1,item2,item3];

const listSchema={
    name: String,
    items: [itemsSchema]
};

const List=mongoose.model("List", listSchema);


app.get("/", function(req,res) {
    Item.find({}).then(function(items) {
          if(items.length===0) {
            Item.insertMany(defaultItems).then(function(){
                console.log("Data inserted")  // Success
            }).catch(function(error){
                console.log(error)      // Failure
            });
            res.redirect("/");
          }
          else {
            res.render("list",{listTitle :"Today", items :items});

          }
        
    });
     
   
});


app.post("/", function(req,res) {
    const itemName=req.body.Next_item;
    const listName=req.body.list;
    const newitem=new Item({
           name: itemName
    });

    if(listName==="Today") {
        newitem.save();
        res.redirect("/");
 
    }
    else {
        List.findOne({name:listName}).then((foundList)=>{

            foundList.items.push(newitem);
            foundList.save();
            res.redirect("/"+ listName);
            
        });
    }
    
});

app.post("/delete", function(req,res) {
    const itemName=req.body.checkbox;
    const listName=req.body.listName;
    if(listName === "Today") {
        Item.deleteOne({ _id: itemName }).then(function(){
            console.log("Data deleted"); // Success
        }).catch(function(error){
            console.log(error); // Failure
        });
        res.redirect("/");

    }
    else {
        List.findOneAndUpdate({name:listName},{$pull :{items: {_id: itemName}}}).then((foundList)=> {
            res.redirect("/"+listName);
        });
        
    }
        

    
    
});

app.get("/:newlist", function(req,res) {
    const type=_.capitalize(req.params.newlist);
    List.findOne({name: type}).then((foundList) =>{
        
             if(!foundList) {
                const list= new List({
                    name: type,
                    items: defaultItems
            
                });
    
            
                list.save();
                res.redirect("/"+type);

             }
             else {
                res.render("list",{listTitle :foundList.name, items :foundList.items});

             }
        })
    });
    

app.listen(process.env.PORT||3000, function(err) {
    if(err) {
        throw err;
    }
    console.log("Successfully started on port 3000");
});