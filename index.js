const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express()

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.a1a1zbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db('SoloSphere');
    const jobsCollection = db.collection('jobs');


    // jobs related APIs
    app.get('/add-jobs/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })

    app.get('/get-jobs', async(req, res) => {
      const email = req.query.email;
      const query = { 'buyer.email': email };
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/add-jobs', async(req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    })

    app.post('/add-jobs', async(req, res) => {
      const job = req.body;
      const result = await jobsCollection.insertOne(job);
      res.send(result);
    })

    app.put('/add-jobs/:id', async(req, res) => {
      const id = req.params.id;
      const job = req.body;
      const query = { _id: new ObjectId(id) };
      const updated = {
        $set: job
      }
      const options = { upsert: true };
      const result = await jobsCollection.updateOne(query, updated, options);
      res.send(result);
    })

    app.delete('/add-jobs/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
