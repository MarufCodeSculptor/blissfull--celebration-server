const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
};
//  external midleweres =>
app.use(express.json());
app.use(cors(corsOptions));
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
    const bookedCollection = client
      .db('services-db')
      .collection('booked-collection');
    // getting all services => => => => =>
    app.get('/services', logger, async (req, res) => {
      const userEmail = req.query.email;
      let query = {};
      if (userEmail) query = { providerEmail: userEmail };
      const data = await servicesCollection.find(query).toArray();
      res.send(data);
    });

    // getting single services by id => => =>=> =>=>
    app.get('/service/:id', logger, async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });
    // add services =>
    app.post('/add-services', logger, async (req, res) => {
      const recievedData = req.body;
      const result = await servicesCollection.insertOne(recievedData);
      res.send(result);
    });
    // updating services =>=>=>=>
    app.patch('/service/:id', logger, async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...updateData,
        },
      };
      const result = await servicesCollection.updateOne(query, updateDoc);
      console.log(result);
      res.send(result);
    });

    // removing item from collections =>=>=>=>
    app.delete('/service/:id', logger, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
    // getting bookings data =>=>=>=>
    app.get('/booked-data', logger, async (req, res) => {
      const userEmail = req.query.email;
      let query = {};
      if (userEmail) query = { 'buyer.buyerEmail': userEmail };
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });
    // getting providers data =>=>=>=>
    app.get('/provider-data', logger, async (req, res) => {
      const userEmail = req.query.email;
      let query = {};
      if (userEmail) query = { 'provider.providerEmail': userEmail };
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });




    // adding bookings data => =>=>=>=>
    app.post('/booked-services', logger, async (req, res) => {
      const data = req.body;
      const result = await bookedCollection.insertOne(data);
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
