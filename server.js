const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
// mongodb
const mongoose = require('mongoose')
const Score = require('./models/score.model.js')

app.use(cors())

function flip() {
    const x = Math.random() * 3;  // Generates a random number between 0 and 3
    if (x < 1) return "rock";      // If x is between 0 and 1, return "rock"
    if (x < 2) return "paper";     // If x is between 1 and 2, return "paper"
    return "scissors";             // If x is between 2 and 3, return "scissors"
}

let rockpaperscissors = {
    'enemy-hand': flip()
}

app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
})

app.get('/api', (request, response) => {
    rockpaperscissors['enemy-hand'] = flip();  // Generate a new hand each time
    response.json(rockpaperscissors);
})

app.post('/api/scores', jsonParser, async (request, response) => {
    try {
        // console.log(request.body)
        // response.send(request.body)
        const score = await Score.create(request.body)
        response.status(200).json(score)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

// connect to mongodb
mongoose.connect('mongodb+srv://admin:pass1234@backend-db.d8rmd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backend-db')
    .then(() => {
        console.log('Connected to mongodb!')
    })
    .catch((err) => {
        console.log(`error: ${err}`)
    })
