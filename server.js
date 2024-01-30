const express = require('express')
//const bodyParser = require('body-parser)

//Create an Express.js instance:
const app = express()

//config Express.js
app.use(express.json())
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
})

const MongoClient = require('mongodb').MongoClient

let db;
MongoClient.connect('mongodb+srv://fa1113:Xterra12345@cluster0.70nbtis.mongodb.net', (err, client) => { //this is the connection link
    db = client.db('webstore') //this is the name of the database from MongoDB Compass software
})

//after you type this line, go to terminal and type this command node server.js
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g.,/collection/messages')
}) //until here

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    //console.log('collection name', req.collection)
    return next()
})

//after u write this piece of code, then go to the terminal and type node server.js
//this is the code to add ur collection basically type http://localhost:3000/collection/products into the browser URL, products is the collection name from webstore database in MongoDB Compass software
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e) //e is error
        res.send(results)
    })
})

//after u write this piece of code, then go to the terminal and type node server.js
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e) //e is error
        res.send(results.ops)
    })
})

//return with object id
//this peice of code is to get a product from the database
//after u write this piece of code, then go to the terminal and type node server.js
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id'
    , (req, res, next) => {
        req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e)
            res.send(result)
        })
    })

//this peice of code is to update anything inside products so eg: price u can just update it using this code
//after u write this piece of code, then go to the terminal and type node server.js
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'sucess' } : { msg: 'error' })
        }
    )
})

//this peice of code is to delete an entire product
//after u write this piece of code, then go to the terminal and type node server.js
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ?
                { msg: 'sucess' } : { msg: 'error' })
        }
    )
})


//always put this piece of code AT THE END
app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000')
})


