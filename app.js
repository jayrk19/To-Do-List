const path = require('path');
const express= require('express');
var exphbs = require("express-handlebars");
const mongoose = require('mongoose')
const app = express();
const port = process.env.PORT || 3000;
const Todo = require('./models/todo')

const MONGODB_URI =
  "mongodb+srv://test:6mT6Lmn9P2iXhPGd@cluster0.nkayd.mongodb.net/Todolist?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI || 'mongodb://localhost/firstmongo',{
  useNewUrlParser:true,
  useUnifiedTopology:true
})

app.use(express.static(path.join(__dirname,"views")))

// express-handlebars
app.engine("handlebars", exphbs({defaulLayout:'main', 
  runtimeOptions: {
     allowProtoPropertiesByDefault: true,

     allowProtoMethodsByDefault: true,
  },
  layoutsDir:'views/layouts'}))
  app.set("view engine", "handlebars");



// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended:false}));








app.get("/", async (req, res) => {
  
  Todo.find((err, docs) => {
    if (!err) {
        res.render("home", {
          data: docs,
        });
      
      } else {
        console.log("Error in retrieving employee list :" + err);
      }
    })
  });
   
  
   
  

  

app.post("/api/create", async (req, res) => {
  var response = new Todo();

  response.record= req.body.input;   
  if(response.record!==''){

    // console.log(response);
    response.save((err,doc)=>{
      if(!err)  res.redirect("/");
      else{
        console.log("Error during insertion : " + err);
      }
    })
  }
  else{
     res.redirect('/');
  }

});

app.post("/api/delete/:id", async (req, res) => {
  Todo.findByIdAndRemove(req.params.id,(err,doc)=>{
    if(!err){
      res.redirect("/")
    }
    else{
      console.log("Error in deletion :" + err);
    }
  })

  // const response = await Todo.deleteOne({ record });



});

app.post("/api/modify", async (req, res) => {
  Todo.findById(req.body.id, (err, doc) => {
    if (!err) {
      doc.record = req.body.changedItem;
      doc.save();
      res.json({
        success: true,
        newValue: req.body.changedItem,
      });
      // res.redirect("/");
    } else {
      console.log("Error in employee delete :" + err);
      res.json({
        success: false,
      });
    }
  });


});







app.listen(port,()=>{

    console.log(`Server runnin' on http://localhost:${port}`);
})