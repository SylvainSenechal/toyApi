const express = require('express')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express()

const { justifyText } = require('./tools.js')

const VERY_VERY_SECRET_KEY = 'notSoSecret'
const MAX_DAILY_WORDS = 80000
const MILLISEC_DAY = 24 * 3600 * 1000
let users = new Map()

app.use(bodyParser.text()) // To parse text request
app.use(bodyParser.json())
app.listen(process.env.PORT || 3000)
console.log('app listening')


const authenticateJWT = (request, response, next) => {
  let authorizationHeader = request.headers.authorization
  if (authorizationHeader) {
    let token = authorizationHeader.split(' ')[1] // [0] is 'bearer', [1] is token
    jwt.verify(token, VERY_VERY_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log('bad token')
        return response.sendStatus(403)
      }
      console.log('valid token')
      request.email = decoded.email
      next()
    })
  } else {
    console.log('no authorization header found')
    return response.sendStatus(401)
  }
}

const checkWordsLimit = (request, response, next) => {
  if (!request.is('text/plain')) {
    return response.sendStatus(400)
  }
  let textToJustify = request.body
  let userLastDayRequests = users.get(request.email).callsHistory.filter(request => request.timestamp + MILLISEC_DAY > Date.now())
  let nbWords = textToJustify.split(' ').filter(word => word !== '').length
  let lastDayNbWords = userLastDayRequests.reduce((acc, request) => request.nbWords + acc, 0)

  if (nbWords + lastDayNbWords > MAX_DAILY_WORDS) {
    console.log('Daily limit reached')
    return response.sendStatus(402)
  }

  users.get(request.email).callsHistory.push({timestamp: Date.now(), nbWords: nbWords})
  next()
}

app.post('/justify', authenticateJWT, checkWordsLimit, (request, response) => {
  let text = request.body
  let justifiedText = justifyText(text)
  response.send(justifiedText)
})

app.post('/token', (request, response) => {
  let email = request.body.email
  if (!email) {
    console.log('no email found')
    return response.sendStatus(400)
  }
  let token = jwt.sign({email: email}, VERY_VERY_SECRET_KEY)

  if (users.has(email)) {
    console.log('user already registered')
  } else {
    users.set(email, {callsHistory: []}) // Add a new user recognized by his token
  }
  response.send(token)
})




// curl -i -H "Content-Type: application/json" --data '{"email": "youhou@hotmail.com"}' localhost:3000/token

// curl -i -H "Content-Type: text/plain" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlvdWhvdUBob3RtYWlsLmNvbSIsImlhdCI6MTYwMjUzMzgyNH0.CAvOIcGXTJUYXCVVFBgqyshX6DW1Wpi1u6gyWh2Bypw" --data "Longtemps, je me suis couché d" localhost:3000/justify

// curl -i -H "Content-Type: text/plain" --data "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint.
//
// Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé.
// Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour." localhost:3000/justify
