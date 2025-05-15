const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
const mongoose = require('mongoose');
const { json } = require('body-parser');

// Connecting the database
app.use(cors());
require("dotenv").config({path: './config/.env'})
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));
// Connecting to DB
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
      app.listen(process.env.PORT, function() {
      console.log(`Listening on port ${process.env.PORT}`);
  });

  })
  .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
  });

// end

// Model

const {Schema }= mongoose

const URL = new Schema({
  original_url: String,
  short_url: String
})

// Model

const modelUrls = mongoose.model("URL", URL);


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Const Schema


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) =>{
  const url = req.body.url;

  if(!url.includes('https://') && !url.includes("http://")){
    return res.json({error: "invalid url"})
  }

  if(true){
    let newDoc = new modelUrls({
      original_url: url,
      short_url: Math.floor(Math.random() * 1000).toString()
    })

    await newDoc.save()
    let data = await modelUrls.findOne({original_url: url})
    res.json({original_url: data['original_url'], short_url: data['short_url']})
  }

  // originalUrls.push(url)
  // shortUrls.push(foundIndex)
  // return res.json({original_url: url, short_url: shortUrls[foundIndex]})
})


app.get("/api/shorturl/:shorturl", async (req, res) => {
    if (parseInt(req.params.shorturl) < 0) {
        return res.json({
            "error": "No short URL found for the given input"
        });
    }
    let data = await modelUrls.findOne({short_url: req.params.shorturl})
    res.redirect(data["original_url"])

});




