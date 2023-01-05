const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express()

const port = process.env.port;

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
     res.send("the server working right now")
})

app.listen(port, () => {
      console.log(`this server run ${port}`)
})