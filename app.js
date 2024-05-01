
const express = require("express");
const cors = require("cors")
const app = express()
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const authRoutes = require('./src/routes/auth')
// const musicArtItemRoutes= require('./src/routes/musicArtItems')
const profileRoutes= require('./src/routes/userprofile')
const storyRoutes= require('./src/routes/stories')

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
require('dotenv').config()

const port = process.env.PORT

app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/musicartitem", musicArtItemRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/stories", storyRoutes);

app.post("/", (req, res)=>{
   const {email, password} = req.body
   console.log(`Your Email is ${email} and your password is ${password}`)
})
app.get("/", (req, res)=>{
    res.json({
        server: "MusicArtApp server",
    });
})

mongoose
    .connect(process.env.DB_URI,{
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("Db connected!"))
    .catch((error) => console.log("Failed to connect", error));



    app.get("/health", (req, res) => {
      res.json({                                                                                                     
          service: "MusicArtApp server",
          status: "Active",
          time: new Date(),
      });
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:8000/`);
});