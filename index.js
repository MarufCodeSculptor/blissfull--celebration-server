const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//  external midleweres =>
app.use(express.json());
app.use(cors());
const logger = async (req, res, next) => {
  const fullurl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log('hitted to => ', fullurl);
  next();
};
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
    //  database and collections =>=> =>=> =>=>
    const servicesCollection = client
      .db('services-db')
      .collection('services-collection');
    // getting all services => => => => =>
    app.get('/services', logger, async (req, res) => {
      const data = await servicesCollection.find().toArray();
      res.send(data);
    });
    // add services =>
    app.post('/add-services', logger, async (req, res) => {
      const recievedData = req.body;
      const result = await servicesCollection.insertOne(recievedData);
      res.send(result);
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

app.get('/', logger, async (req, res) => {
  const message = { message: ' HAY.....server connected successfully....' };
  res.send(message);
});

app.listen(PORT, () => {
  console.log(`your server is trying to run  at PORT ${PORT}`);
});
