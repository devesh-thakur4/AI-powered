const app = require("./src/app")
const connect = require("./src/db/db");
connect();



app.listen(5000,()=>{
    console.log("server is running on port 5000")
})