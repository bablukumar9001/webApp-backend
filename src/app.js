require("dotenv").config()
const express = require("express")
require("./db/conn")
const app = express()
const port = process.env.PORT
// const cors = require('cors');


// app.use(
//      cors({
//           origin: '*',
//      })
// );


app.use(express.json())
app.use(require("./routes/auth"))

app.get("/", (req, res) => {
     res.send(" hello, this is the home page ")
})



app.listen(port, () => {
     console.log(`server  is  listening to port ${port}`);
})