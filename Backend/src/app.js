const express = require("express");
const taskRouter = require("./routes/task.route");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyparser = require("body-parser")


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyparser.json())



app.get("/", (req, res) => {
    res.send("hello world")
    console.log("hello world")
})


app.use("/tasks", taskRouter)

module.exports = app