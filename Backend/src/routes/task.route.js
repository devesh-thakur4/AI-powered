const express = require("express");
const routes = express.Router();
const taskController = require("../controller/task.controller")

routes.get("/getAll", taskController.getAllTask); // get all task

routes.post("/create", taskController.createTask) // create the task and how was created 

routes.delete("/:id", taskController.deleteTask) // delete the task

routes.post("/generate",  taskController.GenerateTask); // generated task

routes.get("/chat/:userId", taskController.getChatHistory);

routes.delete("/chat/clear/:userId", taskController.clearChatHistory);


module.exports = routes