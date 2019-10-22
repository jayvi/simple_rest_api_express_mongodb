require('dotenv').config();
const express = require('express')
const app = express()
const port = 3090
const  mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
  console.log ('were connected!');
});

app.use(express.json())
const subscribersRouter= require('./routes/subscribers')
app.use('/subscribers',subscribersRouter);


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))