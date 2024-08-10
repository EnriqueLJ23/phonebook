const express = require('express');
const app = express();
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/people');

app.use(express.static('dist'))

const cors = require('cors')
app.use(cors());


morgan.token('resBody', function getBody (res) {
    return JSON.stringify(res.body)
  })

app.use(morgan(':method :url :status :res[content-length] :resBody - :response-time ms'))

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



app.get('/api/persons',(request, response) => {
  Person.find({}).then(people => {
   response.json(people)
  })
})

app.get('/api/persons/:id',(request, response,next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person);
    }
    else{
      response.send(404).end();
    }  
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedP => {
      response.json(updatedP)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
    const person = new Person({
      name: body.name,
      number: body.number ,
    })
  
    person.save().then(savedP => {
      response.json(savedP)
    })  

})

app.get('/info',(request, response) => {
    const now = new Date();
    Person.find({})
    .then(result => {
      response.send(`<p>Phonebook has info for${result.length} people</p><p>${now}</p>`)
    })
    
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })