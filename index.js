const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express()

const port = process.env.port;

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
     res.send("<h2 style='color:red'>the bicycle inventory management system application is working</h2>")
})

app.listen(port, () => {
      console.log(`this server run ${port}`)
})