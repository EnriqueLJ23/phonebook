const express = require('express');
var morgan = require('morgan')
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.static('dist'))


morgan.token('resBody', function getBody (res) {
    return JSON.stringify(res.body)
  })

app.use(morgan(':method :url :status :res[content-length] :resBody - :response-time ms'))
let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(express.json());  
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.get('/',(request, response) => {
    response.send("<h1>NIGGER TIER BEHAVIOR </h1>")
})

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
    const id = request.params.id;
    const note = persons.find(p => p.id == id );
    if(note){
        response.json(note);
    }
    else{
        response.send(404).end();
    }
    
})

app.delete('/api/persons/:id',(request, response) => {
    const id = request.params.id;
    persons = persons.filter(p => p.id !== id)
    response.send(204).end();
})

app.post('/api/persons',(request, response) => {
    const body = request.body;
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
      
    const check = persons.find(p => p.name === body.name)
    console.log("nigger goy cattle", check);
    if (check) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

      const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(100000,999999),
      }
    
      persons = persons.concat(person)
      response.json(person)
})

app.get('/info',(request, response) => {
    const now = new Date();
    const people = persons.length
    response.send(`<p>Phonebook has info for${people} people</p><p>${now}</p>`)
})

const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return String(Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled));
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })