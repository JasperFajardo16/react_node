const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config')

//import routes
const authRoute = require('./routes/auth');

//middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.send('homepage')
})

//route middleware
app.use('/api/user', authRoute)


//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!'))

app.listen(8000, () => (
    console.log('Server is Up and Running')
))