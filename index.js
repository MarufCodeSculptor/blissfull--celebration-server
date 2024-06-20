const express = require('express');
const cors =require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//  external midleweres =>
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.6mzg5rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const servicesCollection = client
      .db('services-db')
      .collection('services-collection');
    app.get('/services', async (req, res) => {
      const data = await servicesCollection.find().toArray();
      res.send(data);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
  const message = 'initail message of server';
  res.send(message);
});

app.listen(PORT, () => {
  console.log(`your server is trying to run  at PORT ${PORT}`);
});
