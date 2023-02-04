const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express()

const port = process.env.port;

app.use(cors())
app.use(express.json())





/// database operation from here 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.xw93um8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

      try {
            //  await client.connect()

            const database = client.db("bicycle")
            const allItem = database.collection("allItem")
            const blog = database.collection("blog")

            // post new item
            app.post("/addItem", async (req, res) => {

                
                  const itemQuantity = parseInt(req.body.quantity);
                  const itemPrice = parseInt(req.body.price)



                  const ItemData = {
                        name: req.body.name,
                        image: req.body.image,
                        quantity: itemQuantity,
                        brand: req.body.brand,
                        price: itemPrice
                  }

                
                  const result = await allItem.insertOne(ItemData)
                  res.send(result)
            })
            /// get all items
            app.get("/getItems", async (req, res) => {
                  const query = {}
                  const cursor = allItem.find(query)
                  const result = await cursor.toArray()
                  res.send(result)
            })

            /// get single item from view item in admin

            app.get("/getSingleItem/:id", async (req, res) => {

                  const id = req.params.id;
                  const query = { _id: ObjectId(id) }

                  const result = await allItem.findOne(query)
                  res.send(result)
            })

            /// update all item here

            app.put("/updateItem/:id", async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: ObjectId(id) }
                  const options = { upsert: true };

                  const itemQuantity = parseInt(req.body.quantity)
                  const itemPrice = parseInt(req.body.price)


                  const doc = {
                        $set: {
                              name: req.body.name,
                              image: req.body.image,
                              quantity: itemQuantity,
                              brand: req.body.brand,
                              price: itemPrice
                        }
                  }

                  const result = await allItem.updateOne(filter, doc, options);
                  res.send(result)

            })

            /// delete item 

            app.delete("/deleteItem/:id", async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) }
                  const result = await allItem.deleteOne(query)
                  res.send(result)
            })



             // only update item quantity

             app.put("/quantityUpdateDecrease/:id", async (req, res) => {
                  const id = req.params.id
                  const filter = {_id: ObjectId(id)}
                  const quantity =  parseInt(req.body.quantity)
                  
                  const result =  await allItem.updateOne(filter, {$inc:{quantity: - quantity}})
                  res.send(result)
          })

             app.put("/quantityUpdateIncrease/:id", async (req, res) => {
                     const id = req.params.id
                     const filter = {_id: ObjectId(id)}
                     const quantity =  parseInt(req.body.quantity)
                     
                     const result =  await allItem.updateOne(filter, {$inc:{quantity: quantity}})
                     res.send(result)
             })


             /// blog post manage

             app.post("/postBlog", async (req,res) => {
                      const doc  = req.body;
                      const result = await blog.insertOne(doc)
                      res.send(result)
             })

             app.get('/postBlog', async(req, res) => {
                      
                      const query = {}
                      const cursor = blog.find(query)
                      const result = await cursor.toArray()
                      res.send(result)
             })


             /// get single blog 

             app.get("/blog/:id", async (req, res) => {
                      const id = req.params.id;
                      const query = {_id : ObjectId(id)}
                      const result = await blog.findOne(query)
                      res.send(result)
             })

      }
      finally {
            //    await client.close()
      }

}
run().catch(console.dir())






app.get("/", (req, res) => {
      res.send("<h2 style='color:red'>the bicycle inventory management system application is working</h2>")
})

app.listen(port, () => {
      console.log(`this server run ${port}`)
})