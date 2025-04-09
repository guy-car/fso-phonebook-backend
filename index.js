const express = require('express')
const app = express()

// Define your phonebook data here
let persons = [
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

app.use(express.json())

//// Define your routes
// display hello world at root url
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    console.log("successful GET for http://localhost:3001")
  })

// get data and display on /persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
    console.log("successful GET for http://localhost:3001/api/persons")
})

// info page with number of person in phonebook and time when request received
app.get('/info',(request, response) => {
    const timeOfRequest = new Date()
    const infoEl = 
        `<p>Phonebook has info for ${persons.length} people</p>
        ${timeOfRequest}`
    response.send(infoEl)
    console.log("successful GET for http://localhost:3001/info")
})

// display info a single person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// delete a user Standard RESTful
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(200).end()
})

// delete a user (with added developper info)
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const personToDelete = persons.find(person => person.id === id)

    if (personToDelete) {
        const deletedInfo = {
            message: "Person deleted successfully",
            deleted: personToDelete
        }
        // remove person from persons array
        persons = persons.filter(person => person.id !== id)
        console.log("Deleted: ", personToDelete.name)
        response.status(200).json(deletedInfo)
    } else {
        response.status(404).json({error: "Person not found"})
    }
})

// Add a new user
const generateId = () => (
    Math.floor(Math.random()*100000)
)
console.log(generateId())

app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameAlreadyExists = persons.some(person => person.name === body.name)
    console.log(nameAlreadyExists)
    console.log(body.name)

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (nameAlreadyExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

// Server is listening to port 3001
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})