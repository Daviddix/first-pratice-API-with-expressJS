const express = require("express")
const app = express()
require("dotenv").config()
const cors = require('cors')
const mongoose = require("mongoose")
const animeModel = require("./models/Anime")
const userRouter = require("./routes/UserRoute.js")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        credentials : true,
        origin : "http://127.0.0.1:5500"
    }
))
app.use("/user", userRouter)
 
async function useAuth(req, res,next){
    const token = req.cookies.jwt

    if(!token){
        console.log("no token")
        return res.status(401).json({ error: 'Unauthorized - Missing JWT in cookies',type: "auth error" })
    }

      jwt.verify(token, "daviddixx", async function(err, decoded){
                if(err){
                    console.log("token error")
                    return res.status(401).json({ error: 'Unauthorized - Invalid JWT', type: "auth error"});
                }
                    next()
    })
}

app.get("/anime",  async (req, res)=>{
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

app.delete("/anime/:animeName", useAuth, async (req, res)=>{
    try{
    const animeName = req.params.animeName 

        const deletedAnime = await animeModel.findOneAndDelete({animeName})

        res.status(200).json({status : "success" , message : `deleted ${deletedAnime.animeName} from the database`})
    }
    catch (err){
        res.status(400).json({error : "an error ocurred on the server", type : "server error"})
    }
    
})

app.post("/anime", async (req, res)=>{
    if(req.body){
        const animeToAdd = await animeModel.create(req.body)
        return res.send("anime added")
    }
    return res.status(400).send("an error ocurred") 
})
 
app.patch("/anime/:animeId", useAuth, async (req, res)=>{
    try{
            const id = req.params.animeId
            const thingsToUpdate = req.body
            if(!thingsToUpdate){
                throw Error("body cannot be empty")
            }
            let animeToUpdate = await animeModel.findByIdAndUpdate(id, thingsToUpdate, {returnDocument : 'after'})

            res.send(animeToUpdate)  
    }
    catch(err){
        res.status(400).json({status : "failed", type : "server error", moreInfo : err})
    }
      
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