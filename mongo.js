const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.sjih6yh.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length > 3) {
    // Add a new person
    console.log("let's add this person")
    const personName = process.argv[3]
    const personNumber = process.argv[4]

    const person = new Person({
        name: personName,
        number: personNumber
    },)

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to the phonebook`)
        mongoose.connection.close()
    })
    } else if (process.argv.length === 3) {
        console.log("I'm running here")
        // Get all contacts from phonebookApp
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
    }



