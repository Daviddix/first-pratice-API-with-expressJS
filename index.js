const express = require("express")
const app = express()
let animeData = require("./animeData")
const port = process.env.PORT || 3000

app.use(express.json())

app.get("/anime", (req, res)=>{
    res.send(animeData)  
})

app.get("/anime/:animeId", (req, res)=>{
    const id = req.params.animeId 

    const particularAnime = animeData.filter((anime) => anime.id == id)
    
    if (particularAnime.length > 0){
        return res.send(particularAnime)
    }
    
     return res.status(404).json({status: "failed", message : "Anime not found"})

})

app.delete("/anime/:animeId", (req, res)=>{
    const id = parseInt(req.params.animeId)

    animeData = animeData.filter((anime) => anime.id !== id)

    res.send(animeData)
})

app.post("/anime", (req, res)=>{
    const newAnime = req.body
    console.log(newAnime)

    if(Object.keys(newAnime).length === 0) return res.status(405).send({status : "Empty value found", message : "Body cannot be empty"})

    animeData = [...animeData, newAnime]
    res.send("Anime Added to DB")
})

app.patch("/anime/:animeId", (req, res)=>{
    const id = req.params.animeId 

    const thingsToUpdate = req.body

    let particularAnimeIndex = animeData.findIndex((anime)=> anime.id == id)
    if (particularAnimeIndex == -1) {
        return res.status(404).send({status : "failed", message : `anime with the id of ${id} not found`})
    }
    animeData[particularAnimeIndex] = {...animeData[particularAnimeIndex], ...thingsToUpdate}
    res.send({status : "Successful", data : animeData[particularAnimeIndex]})
})

app.listen(port, () => {
    console.log('App listening on port 3000!');
});