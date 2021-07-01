const express = require("express");
const connectDB = require("./config/db");
const env = require("dotenv");

const app = express();

// connecting database
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));

app.get("/", (req, res) => res.send("Api running"));

app.listen(PORT, () => console.log("SERVER RUNNING"));
