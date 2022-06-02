const express = require("express");

//Utils

const app = express();
//Routes

const { userRouter } = require("./Routes/users.routes");
const { repairRouter } = require("./Routes/repair.routes");

const path = require("path");

const { globalErrorHandler } = require("./Controllers/error.controller");
//Endpoints

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/repairs", repairRouter);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Compress responses

app.use("*", globalErrorHandler);
module.exports = { app };
