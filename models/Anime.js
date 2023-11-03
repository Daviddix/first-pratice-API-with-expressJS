const mongoose = require("mongoose")

const animeSchema = new mongoose.Schema({
    animeName : {type : String, required : true, unique : true},
    noOfEpisodes :  {type : Number, required : true},
    mainCharacter :  {type : String, required : true},
    antagonist :  {type : String, required : true},
    siteToWatch : {type : [String], required : true},
    seasons : {type : Number, required : true},
    status : {type : String, required : true},
})

const animeModel = mongoose.model("Animes", animeSchema)

module.exports = animeModel