const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors')
const cookieParser = require('cookie-parser');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json())
app.use(cookieParser());

routes(app);


mongoose.connect(`${process.env.MONGGO_DB}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running in port:', + port) 
})
