// edge case : empty line, word > 80, weird paragragp structure


const express = require('express')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express()

const { justifyText } = require('./tools.js')

const VERY_VERY_SECRET_KEY = 'notSoSecret'
const MAX_DAILY_WORDS = 80000
//  80 000 mots par token par jour sinon renvoyer 402

app.use(bodyParser.text()) // To parse text request
app.use(bodyParser.json())

app.listen(3000)
console.log('app listening')

let users = new Map()

users.set('sylvain', {wordsCount: 5})
console.log(users.has('sylvain'))
console.log(users.has('julien'))
console.log(users.get('sylvain'))
console.log(users.get('julien'))


const authenticateJWT = (request, response, next) => {
  let authorizationHeader = request.headers.authorization
  if (authorizationHeader) {
    let token = authorizationHeader.split(' ')[1] // [0] is 'bearer', [1] is token
    jwt.verify(token, VERY_VERY_SECRET_KEY, (err, decoded) => {
      if (err) {
        return response.sendStatus(403)
      }
      request.email = decoded.userMail
      next()
    })
  } else {
    response.sendStatus(401)
  }
}

const checkWordsLimit = (req, res, next) => {
  console.log('oui')
  console.log(req.email)
  next()
}

app.post('/justify', authenticateJWT, checkWordsLimit, (request, response) => {
  console.log(request.headers)
  console.log(request.email)
  if (!request.is('text/plain')) {
    response.sendStatus(400)
  } else {
    let text = request.body
    console.log(text)
    let justifiedText = justifyText(text)
    response.send(justifiedText)
  }
})



app.post('/token', (request, response) => {
  console.log(request.body)
  let {nom, prenom} = request.body
  console.log(nom, prenom)

  let token = jwt.sign({userMail:"name"}, VERY_VERY_SECRET_KEY)

  let v1 = jwt.verify(token, VERY_VERY_SECRET_KEY)
  let v2 = jwt.verify(token, VERY_VERY_SECRET_KEY)
  console.log(v1)
  console.log(v2)
  response.send(token)
})




// curl -i -H "Content-Type: application/json" --data '{"nom": "sene", "prenom": "sylvain"}' localhost:3000/token

// curl -i -H "Content-Type: text/plain" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTWFpbCI6Im5hbWUiLCJpYXQiOjE2MDI0NTgxMDZ9.kbuRHIdRZ4oWKwrxNKvXqyXg29I1tx0mletL7pv5jCA" --data "Longtemps, je me suis couché d" localhost:3000/justify

// curl -i -H "Content-Type: text/plain" --data "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint.
//
// Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé.
// Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour." localhost:3000/justify
