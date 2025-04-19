require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')

const app = express()

// Create a custom token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body))
// Use morgan with a custom format that includes the body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message
        })
    }
    next(error)
}

app.use(express.static('dist'))
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    console.log("successful GET for http://localhost:3001")
  })

//////////////////////////////////////////
///////        ROUTES              ///////   
//////////////////////////////////////////


/////////////////////
///////GET all phonebook entries
/////////////////////
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
        console.log("successfully fetched all phonebook entries")
    })
})

/////////////////////
///////Load info page with number of phonebook entries + time of request
/////////////////////
app.get('/info',(request, response) => {
    const count = Person.countDocuments({})
    const timeOfRequest = new Date()
    const infoEl = 
        `<p>Phonebook has info for ${count} people</p>
        ${timeOfRequest}`
    response.send(infoEl)
    console.log("successfully counted number of documents")
})

/////////////////////
///////GET info for a single person
/////////////////////
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

/////////////////////
///////POST new person
/////////////////////
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing',
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number 
    })
    console.log('Attempting to save person:', person);

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {
        console.log('Validation error:', error)
        next(error)
    })
})

/////////////////////
///////DELETE new person
/////////////////////

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

})

/////////////////////
///////PUT change existing number
/////////////////////

app.put('/api/persons/:id', (request, response, next) => {
    console.log("heya")
    const {name, number} = request.body
    Person.findById(request.params.id)
    .then(person => {
        if (!person) {
            console.log("no such person")
            return response.status(404).end()
        }
        console.log("let's update this number")
        person.name = name
        person.number = number

        return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

app.use(errorHandler)

// Server is listening to port 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})