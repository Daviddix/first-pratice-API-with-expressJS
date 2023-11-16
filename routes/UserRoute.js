const express = require("express")
const userModel = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userRouter = express.Router()

function generateJwtToken(userId){
    return jwt.sign({userId}, "daviddixx", {expiresIn : 500000})
}

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
                req.user = decoded
                    next()
    })
}

userRouter.post("/signup", async (req, res)=>{
    try{
        if(req.body.username){
                const {username, email, password} = req.body
                const newUser = await userModel.create({username, email, password})
                const userToken = await generateJwtToken(newUser._id)
                res.cookie("jwt", userToken)
                res.status(201).json({status : "success", data : newUser})
            }
            throw Error("no body data")
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
    
})

userRouter.post("/login", async (req, res)=>{
    try{
        if(req.body){
                const {username, password} = req.body
                const userInDb = await userModel.findOne({username})
                if(!userInDb){
                  throw Error("user not found")
                }
                
                const passwordIsCorrect = await bcrypt.compare(password, userInDb.password)
                
                if(!passwordIsCorrect){
                    throw Error("password is not correct")
                }

                   const userToken = await generateJwtToken(userInDb._id)
                res.cookie("jwt", userToken)
                res.status(201).json({status : "success", data : userInDb})
            }
            return new Error("no body data")
    }
    catch(err){
        res.status(400).json({type : "validation error", err})
    }
}) 

userRouter.get("/profile", useAuth, async(req, res)=>{
    try{
        const userId = req.user.userId
        const username = await userModel.findById(userId, "username")
       if(!username){
        throw Error("user not found")
       }
       res.json({username})
       console.log(username)
    }catch(err){
        res.status(404).json({error : "User not found", type : "server error"})
    }
})

userRouter.get("/logout", async(req,res)=>{
    try{
        res.cookie("jwt", "").json({status : "success"})
    }
    catch(err){
        res.status(400).json({status : "failed"})
    }
})

module.exports = userRouter