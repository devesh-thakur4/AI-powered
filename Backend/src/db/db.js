const mongoose = require("mongoose");

function connect (){
    mongoose.connect("mongodb://localhost:27017/task")

    .then(()=>{
        console.log("connected to DB")
    })

    .catch((err)=>{
        console.log(err)
    })

};


module.exports = connect