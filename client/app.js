const form = document.querySelector(".form")

const animeName = document.querySelector("#anime-name")

const noOfEpisodes = document.querySelector("#anime-episodes")

const mainCharacter = document.querySelector("#anime-mc")

const antagonist = document.querySelector("#anime-villan")

const animeSites = document.querySelector("#sites-to-watch")

const noOfSeasons = document.querySelector("#anime-seasons")

const animeStatus = document.querySelector("#anime-status")


const updateForm = document.querySelector(".update-form")

const updateAnimeName = document.querySelector("#update-anime-name")

const updateNoOfEpisodes = document.querySelector("#update-anime-episodes")

const updateMainCharacter = document.querySelector("#update-anime-mc")

const updateAntagonist = document.querySelector("#update-anime-villan")

const updateAnimeSites = document.querySelector("#update-sites-to-watch")

const updateNoOfSeasons = document.querySelector("#update-anime-seasons")

const updateAnimeStatus = document.querySelector("#update-anime-status")


const animeDbContainer = document.querySelector(".animes-container")

const updateModal = document.querySelector(".update-overlay")



getAllAnimeFromDb()

form.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const animeData = {
      animeName : animeName.value,
      noOfEpisodes : Number(noOfEpisodes.value),
      mainCharacter : mainCharacter.value,
      antagonist : antagonist.value,
      siteToWatch: animeSites.value.split(","),
      seasons: Number(noOfSeasons.value),
      status: animeStatus.value,
    }
    await sendDataToDb(animeData)
    getAllAnimeFromDb()
})

async function sendDataToDb(data){
    try{
         const sendingAnime = await fetch("https://anime-api-yyag.onrender.com/anime",{
            method : "POST",
            body : JSON.stringify(data),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        alert("Anime added to DB")
        return sendingAnime
    }
    catch (err){
        console.log(err)
        alert("An error ocurred")
    }
}

async function getAllAnimeFromDb(){
    try{
        const req = await fetch("https://anime-api-yyag.onrender.com/anime")
        const data = await req.json()
        let animes = ""
        data.forEach((animeFromDb)=>{
            animes +=` <div data-id=${animeFromDb._id} class="anime"> 
            <span>Name:</span> <span class="name">${animeFromDb.animeName}</span>
            <p>Number of episodes:${animeFromDb.noOfEpisodes}</p>
            <p>Main Character:${animeFromDb.mainCharacter}</p>
            <p>Anime Antagonist:${animeFromDb.antagonist}</p>
            <p>Sites to watch : ${animeFromDb.siteToWatch.join(",")}</p>
            <p>Number of Seasons :${animeFromDb.seasons}</p>
            <p>Anime Status : ${animeFromDb.status}</p>

            <div class="button-container">
            <button>Delete Anime</button>
            <button>Update Anime</button>
            </div>
            
        </div>`
        })
        animeDbContainer.innerHTML = animes
    }
    catch(err){
        animeDbContainer.innerHTML = `<p>Failed to fetch Animes from Database</p>`
        console.log(err) 
    }
}

async function deleteAnimeFromDb(nameOfAnimeToDelete){
    try{
        const deletedAnime = await fetch(`https://anime-api-yyag.onrender.com/anime/${nameOfAnimeToDelete}`,{
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        alert(`${nameOfAnimeToDelete} has been deleted`)
        return deletedAnime
   }
   catch (err){
       console.log(err)
       alert("An error ocurred")
   }
}

function populateUpdateInputs(dataObj){
    updateAnimeName.value = dataObj.animeName
    updateNoOfEpisodes.value = dataObj.noOfEpisodes
    updateMainCharacter.value = dataObj.mainCharacter
    updateAntagonist.value = dataObj.antagonist
    updateAnimeSites.value = dataObj.siteToWatch.join(",")
    updateNoOfSeasons.value = dataObj.seasons
    updateAnimeStatus.value = dataObj.status
    updateForm.dataset.id = dataObj._id
}

async function getSingleAnime(singleAnimeName){
    try{
        const res = await fetch(`https://anime-api-yyag.onrender.com/anime/${singleAnimeName}`)
        const data = await res.json()
        return data
    }
    catch(err){
        console.log(err)
        alert("an error ocurred when getting anime info")
    }
}

async function updateAnime(idOfAnimeToUpdate, data){
    try{
        const updateRes = await fetch(`https://anime-api-yyag.onrender.com/anime/${idOfAnimeToUpdate}`,{ 
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body :JSON.stringify(data) 
        })
        updateModal.classList.add("hidden")
        return updateRes
    }
    catch(err){
        console.log(err)
        alert("couldn't update")
    }
}

animeDbContainer.addEventListener("click", async (e)=>{
    const textInButton = e.target.textContent
    if( textInButton == "Delete Anime"){
        const animeNameToDelete = e.target.parentElement.parentElement.querySelector(".name").innerText

        await deleteAnimeFromDb(animeNameToDelete)
        getAllAnimeFromDb()
    }
    else if(textInButton == "Update Anime"){
        const animeName = e.target.parentElement.parentElement.querySelector(".name").innerText

        const animeData = await getSingleAnime(animeName)
        populateUpdateInputs(animeData)       
        updateModal.classList.remove("hidden")
    }
})

updateForm.addEventListener("submit", async(e)=>{
    e.preventDefault()
    const animeData = {        
        animeName : updateAnimeName.value,
        noOfEpisodes : Number(updateNoOfEpisodes.value),
        mainCharacter : updateMainCharacter.value,
        antagonist : updateAntagonist.value,
        siteToWatch: updateAnimeSites.value.split(","),
        seasons: Number(updateNoOfSeasons.value),
        status: updateAnimeStatus.value,
      }

    await updateAnime(updateForm.dataset.id, animeData)
    getAllAnimeFromDb()

})
