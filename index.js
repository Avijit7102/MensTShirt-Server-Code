const express = require('express')
const app = express()
const cors = require('cors');
//const admin = require('firebase-admin');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 8800;
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wy6ti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('mens T-shirt Server')
  })
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("mensTShirt").collection("products");
  const orderCollection = client.db("mensTShirt").collection("orders");

  console.log('database connected')

  //Delete
  app.delete('/deleteProduct/:id', (req,res) => {
    const id = ObjectId(req.params.id);
    
    productCollection.findOneAndDelete({_id: id})
    
})


  // adding products on database
  app.post('/addProduct', (req,res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent);
    productCollection.insertOne(newEvent)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

//for orders component

app.post('/addOrder', (req, res) => {
  const newOrder = req.body;
   orderCollection.insertOne(newOrder)
       .then(result => {
          res.send(result.insertedCount > 0);
     })
  
})

//order details from database

app.get('/yourOrder', (req,res) => {
   orderCollection.find({userEmail: req.query.email})
   .toArray((err, items) => {
      res.send(items)
   })
  
})


app.get('/products', (req,res) => {
    productCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})

//for checkout
app.get('/checkout/:id', (req,res) => {
    const id = ObjectId(req.params.id)
    productCollection.find(id)
    .toArray((err, items) => {
        res.send(items)
    })
})


});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})