const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mjee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('findingParadise')
        // collection for all packages 
        const packageCollection = database.collection('packages')
        // collection for booking 
         const bookingCollection = database.collection('bookings')
// GET API 
        // package load api 
        app.get('/packages', async(req, res)=>{

           const packages = packageCollection.find({});
           const result = await packages.toArray()
           res.json(result)

        })
        // dynamic package load 
        app.get('/packages/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await packageCollection.findOne(query)
            res.send(result)
        })
        // bookings loading api 
        app.get('/myBookings',async(req, res)=>{
            const query = bookingCollection.find({});
            const result = await query.toArray()
            res.json(result)
        })
        
// POST API
        // Order api 
        app.post('/booking', async(req, res)=>{
            const order = req.body;
             const result = await bookingCollection.insertOne(order) 
             res.send(result)
        })

        // Order remove api 
        app.delete('/myBookings/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await bookingCollection.deleteOne(query) 
            res.send(result)
        })

        // add new Package api 
        app.post('/addPackage', async(req, res)=>{
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage); 
            res.send(result)
        })

        
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/',(req, res)=>{
    res.send('Hey this is finding paradise web server')
})

app.listen(port, ()=>{
    console.log("listening to port", port)
})