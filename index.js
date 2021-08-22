const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjved.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello !!! I am Student Collection");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const StudentCollection = client.db("student").collection("info");

  console.log(process.env.DB_PASS);

  app.post("/addStudentDetails", (req, res) => {
    const newTask = req.body;
    StudentCollection.insertOne(newTask).then((result) => {
      console.log(result, "Task Inserted");
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/studentDetails", (req, res) => {
    StudentCollection.find().toArray((err, events) => {
      res.send(events);
      // console.log(events);
    });
  });

  app.get("/studentDetails/:id", (req, res) => {
    //   console.log(req.params.id)
    StudentCollection.findOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        // console.log(result, "Finded");
        res.send(result);
      }
    );
  });

  app.delete("/deleteTask/:id", (req, res) => {
    console.log(req.params.id);
    StudentCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        // console.log(result, "Deleted");
        res.send(result.deletedCount > 0);
      }
    );
  });
});

app.listen(process.env.PORT || port);
