const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
.then(() => {
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let allChats = [
    {
        from: "neha",
        to: "sneha",
        msg: "send me notes for the exam",
        created_at: new Date(),
      },
      {
        from: "rohit",
        to: "mohit",
        msg: "teach me JS callbacks",
        created_at: new Date(),
      },
      {
        from: "Bholu",
        to: "Preeti",
        msg: "All the best for both together",
        created_at: new Date(),
      },
      {
        from: "Khushboo",
        to: "Rupanshu",
        msg: "bring me some fruits",
        created_at: new Date(),
      },
      {
        from: "Tony",
        to: "soniya",
        msg: "love you 3000",
        created_at: new Date(),
      },
      
]

Chat.insertMany(allChats);

