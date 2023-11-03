const express = require("express")
const app = express()
require("dotenv").config()
const cors = require('cors')
const mongoose = require("mongoose")
let animeData = require("./animeData")
const animeModel = require("./models/Anime")
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

app.use(express.json())
app.use(cors())
 

app.get("/anime", async (req, res)=>{
    const animesFromDB = await animeModel.find()
    res.send(animesFromDB)
})

app.get("/anime/:animeName", async (req, res)=>{
    const animeName = req.params.animeName 

    const particularAnime = await animeModel.findOne({animeName})
    
    if (particularAnime.length !== null){
        return res.send(particularAnime)
    }
    
     return res.status(404).json({status: "failed", message : "Anime not found"})

})

app.delete("/anime/:animeName", async (req, res)=>{
    const animeName = req.params.animeName 

    const deletedAnime = await animeModel.findOneAndDelete({animeName})

    res.send(`deleted ${deletedAnime.animeName} from the database`)
})

app.post("/anime", async (req, res)=>{
    if(req.body){
        const animeToAdd = await animeModel.create(req.body)
        return res.send("anime added")
    }
    return res.status(400).send("an error ocurred") 
})
 
app.patch("/anime/:animeName", async (req, res)=>{
    const name = req.params.animeName 
    const thingsToUpdate = req.body
    console.log(thingsToUpdate)

    let animeToUpdate = await animeModel.findOneAndUpdate({animeName : name}, thingsToUpdate, {new : true})

    res.send(animeToUpdate)
})


mongoose.connect(MONGO_URI)
.then(()=>{
    app.listen(port, () => {
    console.log('App listening on port 3000!');
})
})
.catch((err)=>{
    console.log("an error ocurred", err)
})