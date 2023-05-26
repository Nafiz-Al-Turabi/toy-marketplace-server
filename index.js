const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());


// mongoDB start


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f75tpn0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db('ToyMarketplace').collection('toys')

    // Add toy
    app.post('/postToy', async (req, res) => {
      const request = req.body;
      console.log(request);
      const result = await toyCollection.insertOne(request)
      res.send(result)
    })

    // get toys
    app.get('/allToys', async (req, res) => {
      const result = await toyCollection.find({}).toArray();
      res.send(result)
    })

    // toy details
    app.get('/toyDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    // my toys
    app.get('/myToys/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await toyCollection.find({ email: req.params.email }).toArray();
      res.send(result)

    })

    //Update my toy

    app.put('/updateToy/:id', async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const update = {
        $set: {
          price: data.price,
          quantity: data.quantity,
          tot_details: data.toy_details
        }
      }
      const result = await toyCollection.updateOne(filter, update)
      res.send(result)
    })

    //delete operation

    app.delete('/deleteMyToy/:id', async (req, res) => {
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await toyCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// mongoDB end..


app.get('/', (req, res) => {
  res.send('Marketplace is running..')
})
app.listen(port, () => {
  console.log(`Marketplace running on port: ${port}`);
})