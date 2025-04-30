const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONCO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on post 5000"));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);