const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/users");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

// connecting database

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postRouter);

console.log(process.env.PORT || 5000);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log("server running successfully")
    );
  })
  .catch((err) => console.log(`${err.message}.`));
