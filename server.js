import express from 'express'
import cors from 'cors'
import expressListEndpoints from 'express-list-endpoints'
import artistData from './data/artists.json'

// Defines the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

// List of all artists
app.get('/artists', (req, res) => {
  res.json(artistData)
})


app.get('/artists/:name', (req, res) => {
  const name = req.params.name
  const artistWithName = artistData.filter((artist) =>  artist.name.replace(/ /g, "_").toLowerCase() === name.toLowerCase()
  if (artistWithName.length > 0) {
    res.json(artistWithName)
  } else {
    res.status(404).json({ error: 'Could not find an artist with this name. Try underscoring the space between, like this: Damien_Hirst'})
    } 
  }
)

// Endpoint gender
app.get('/gender/:gender', (req, res) => {
  const gender = req.params.gender
  const showAlive = req.query.alive === 'true'
  const showDeceased = req.query.alive === 'false'
  let artistsOfGender = artistData.filter(
    (artist) => artist.gender.toLowerCase() === gender
  )

  if (showAlive) {
    artistsOfGender = artistsOfGender.filter((artist) => artist.alive === true)
  }
  if (showDeceased) {
    artistsOfGender = artistsOfGender.filter((artist) => artist.alive === false)
  }
  if (artistsOfGender.length > 0) {
    res.json(artistsOfGender)
  } else {
    res.status(404).json({ error: 'Could not find artists of this kind, try endpoints: female / male. You can also add alive=true or alive=false at the end' })
  }
})

//Endpoint technique
app.get('/technique/:technique', (req, res) => {
  const technique = req.params.technique
  const artistsUsingTechnique = artistData.filter((artist) => {
    const lowerCase = artist.technique.map((tech) => tech.toLowerCase())
    return lowerCase.includes(technique)
  })

  if (artistsUsingTechnique.length > 0) {
    res.json(artistsUsingTechnique)
  } else {
    res
      .status(404)
      .json({ error: 'Could not find artists making art of this kind, try endpoints like: painting / installation / sculpture / performance / film etc' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
