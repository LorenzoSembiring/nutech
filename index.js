const express = require('express');
const authRoute = require('./src/routes/authRoute');
const userRoute = require('./src/routes/userRoute');
const informationRoute = require('./src/routes/informationRoute');
const transactionRoute = require('./src/routes/transactionRoute');
require('dotenv').config();
const app = express();
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', authRoute)
app.use('/', userRoute)
app.use('/', informationRoute)
app.use('/', transactionRoute)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
