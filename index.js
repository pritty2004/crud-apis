const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// //index Rout
//   app.get("/chats", async (req, res) => {
//     try {
//     let chats = await Chat.find();
//     //console.log(chats);
//     //res.send("working");
//     res.render("index.ejs", {chats});
//     } catch(error) {
//         console.log(error);
//         res.sendStatus(500).send("An error occurred while fetching chats");
        
//     }
//   });


// Index Route
app.get("/chats", async (req, res) => {
  try{
    let chats = await Chat.find();
    console.log(chats);
  res.render("index.ejs", { chats });
  } catch(err){
    next(err);
  }
});



 //New Route
  app.get("/chats/new",(req, res) => {
    //throw new ExpressError(404, "Page not found");
    res.render("new.ejs");
  });

  //create route
  app.post("/chats", asyncWrap(async (req, res, next) => {
      let {from, to, msg} = req.body;
      let newChat = new Chat({
          from: from,
          to: to,
          msg: msg,
          created_at: new Date(),
      });
      await newChat.save();
      res.redirect("/chats");
    })
  );
  //   newChat
  //   .save() //asynchronus process
  //   .then((res) => { //no need to write await where to write a then key no need to write to await keyword
  //       console.log("chat was saved");
  //   })
  //   .catch((err) => {
  //      console.log(err);
  //   });
  //   res.redirect("/chats");
  //   res.send("working");
  // });
  
  
  
   //using wrapAsync
  function asyncWrap(fn) {
    return function (req, res, next) {
      fn(req, res, next).catch((err) => next(err));
    };
  }

  //New - Show Route
  app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    // try{
      let { id } = req.params;
    let chat =  await Chat.findById(id);
    if(!chat) {
      next(new ExpressError(404, "chat not found"));
    }
    res.render("edit.ejs", { chat });
    // } catch(err) {
    //   next(err);
    // }
  }));



  //Edit Route
  app.get("/chats/:id/edit", asyncWrap(async (req, res) => {
      let {id} = req.params;
      let chat = await Chat.findById(id);
      console.log(chat);
      res.render("edit.ejs", { chat });
    
  }
)); 



  // Upadate Route

  app.put("/chats/:id", asyncWrap(async (req, res) => {
      let { id } = req.params;
      let { msg: newMsg } = req.body;
      console.log(newMsg);
      let updatedChat = await Chat.findByIdAndUpdate(
      id, 
      { msg: newMsg },
      { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats");
    
  })
);

  //Delete Route
    
  app.delete("/chats/:id", asyncWrap(async (req, res) => {
      let { id } = req.params;
      let deletedChat = await Chat.findByIdAndDelete(id);
      console.log(deletedChat);
    res.redirect("/chats");
    
  }));



// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheets",
//     created_at: new Date(),
// });

// chat1.save()
// .then((res) => {    //UTc according time set
//     console.log(res);
// });


app.get("/", (req, res) => {
    res.send("working root");
});

//error has to be clube in function\
const handleValidationErr = (err) => {
  console.log("This was a Validation error. Please follow rules");//ye work hai jo hum function se karvane vale hai
  console.dir(err.message);
  return err;
};

//another error-handling-middileware
app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name === "ValidationError"){
    handleValidationErr(err);
    //console.log("This was a Validation error. Please follow rules");
  }
  next(err);
});


//Error Hamdling Middileware
app.use((err, req, res, next) => {
    let { status=500, message="Some Error Occured"} = err;
    res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listing on port 8080");
});