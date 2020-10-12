# toyApi
Justify a long text with this api.
First get an access token, then you can use it up to 80K words a day

## Test Locally :
- install npm dependencies : ```npm install```
- run server with ```node index.js```

1. First get an access token with : curl -i -H "Content-Type: application/json" --data '{"email": "**youremailAThotmail.com**"}' localhost:3000/token
2. Justify your text with the token you just received : curl -i -H "Content-Type: text/plain" -H "Authorization: Bearer **TOKEN_RECEIVED_PREVIOUSLY**" --data "**TEXT_TO_JUSTIFY**" localhost:3000/justify

## Using the hosted app :
You can do the same thing with the hosted app by changing the URL : replace **localhost:3000/token** with **https://immense-caverns-24723.herokuapp.com/token**
Example : curl -i -H "Content-Type: application/json" --data '{"email": "youhouAThotmail.com"}' https://immense-caverns-24723.herokuapp.com/token
