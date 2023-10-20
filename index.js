const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsewnp0.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("assignmentDB").collection("products");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const brand = req.params.id;
      const query = { brand: brand };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const coffee = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          types: updateProduct.types,
          price: updateProduct.price,
          description: updateProduct.description,
          rate: updateProduct.rate,
        },
      };
      const result = await productCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // Cart collection
    const cartCollection = client.db("assignmentDB").collection("carts");

    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const query = { productId: cart.productId, userEmail: cart.userEmail };
      const findOne = await cartCollection.findOne(query);
      if (findOne) {
        return res.send({ find: true });
      }
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/carts/:id", async (req, res) => {
      const email = req.params.id;
      const query = { userEmail: email };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(query);
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { productId: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 10 Server Side");
});

app.listen(port, () => {
  console.log(`This server is running on port: ${port}`);
});
