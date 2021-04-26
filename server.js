const express = require('express');
const bodyParser= require('body-parser')
require('dotenv').config();
const app = express();
const MongoClient = require('mongodb').MongoClient


MongoClient.connect(process.env.MONGO_DB_CONNECTION, { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('lead-form-users')
        const usersCollection = db.collection('users')

        app.post('/lead-form', (req, res) => {
            usersCollection.insertOne(req.body)
                .then(result => {
                    res.status(200).send({result:"success","message":"Successfully Added"})
                })
                .catch(error => {
                    console.error(error)
                    res.status(400).send({result:"error","message":error.message})
                })
        })

            app.get('/lead-list', (req, res) => {
            usersCollection.find().toArray()
                .then(result => {
                    res.status(200).send({result:"success",data:result})
                })
                .catch(error => {
                    console.error(error)
                    res.status(400).send({result:"error","message":error.message})
                })
        })

    })
    .catch(console.error)


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})
app.get('/leads', (req, res) => {
    res.sendFile(__dirname + '/views/leads.html')
})


app.listen(3008, function() {
    console.log('listening on 3008')
})