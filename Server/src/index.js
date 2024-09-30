require("dotenv").config({path:'../.env'});
const express = require("express")
const app = express();
// const PORT = 5000;
const configMiddlewares = require("./config/configMiddlewares");
const colors = require("colors");
const routes = require("./config/routes")
const db = require("./config/db");


// Config Middlewares
configMiddlewares(app)

// Config Routes
routes(app)



app.listen(process.env.PORT, () => {
    console.log(`Server is Listening to ${process.env.PORT}`.bgGreen.bold);
})