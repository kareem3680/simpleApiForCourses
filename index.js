const express = require("express");
app = express();

const cors = require("cors");
require("dotenv").config();

const path = require("path");
app.use("/api/Uploads", express.static(path.join(__dirname, "./Uploads")));

const mongoose = require("mongoose");
const url = process.env.mongo_url;
mongoose.connect(url).then(() => {
  console.log("mongo server started");
});

app.use(cors());
app.use(express.json());

const coursesRouter = require("./routes/course-route.js");

app.use("/api/courses", coursesRouter);

const userRouter = require("./routes/user-route.js");
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({ status: "failed", message: "NOT FOUND" });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText,
    message: error.message,
    code: error.statusCode,
    data: error.data
  });
});

app.listen(process.env.port, () => {
  console.log(`listening on port: ${process.env.port}`);
});
