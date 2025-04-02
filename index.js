const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const blogRoutes = require("./routes/blogRoutes")
const cors = require("cors");
mongoose.connect("mongodb://127.0.0.1:27017/blogs",{useNewUrlParser:true,useUnifiedTopology:true}).then(() => {
    console.log("Connected to DB")
})

const express = require("express")
const app = express()
app.use(express.json())
app.use(cors())
app.use("/users", userRoutes)
app.use("/blogs", blogRoutes)
app.listen(3000,() => {
    console.log("Server is running on port 3000")
})