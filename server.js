const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
require("dotenv").config();
const PORT = 3200;

let db;
let dbConnectionString = process.env.DB_CONNECTION;
let dbName = "album-list";

MongoClient.connect(dbConnectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to " + dbName);
    db = client.db(dbName);
  }
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get("/", async(req, res) =>{
//     try {
//         const albumsNames = db.collection('albumnames').find().toArray();
//     res.render("index.ejs", {
//         albums: albumsNames,
//         artists: artistNames,
//     })
//     } catch (error) {
//         error => console.log(error)
//     }
// })

app.get("/", (req, res) => {
  db.collection("albums")
    .find()
    .toArray()
    .then((data) => {
      res.render("index.ejs", { info: data });
    })
    .catch((error) => console.log(error));
});

app
  .post("/addAlbum", (req, res) => {
    db.collection("albums")
      .insertOne({
        albumname: req.body.albumname,
        artistname: req.body.artistname,
        photo: req.body.photo,
        likes: 0,
      })
      .then((result) => {
        console.log("Album added");
        res.redirect("/");
      });
  })

  .listen(PORT, () => {
    console.log("The server is running on PORT " + PORT);
  });
