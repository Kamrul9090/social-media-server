const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.REACT_APP_user_name}:${process.env.REACT_APP_dbPassword}@cluster0.zvviljv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postsData = client.db('dbSocialMedia').collection('postData');
        const postComments = client.db('dbSocialMedia').collection('PostComments');

        app.get('/post', async (req, res) => {
            const query = {};
            const result = await postsData.find(query).toArray();
            res.send(result);
        })
        app.get('/comments', async (req, res) => {
            const filter = {}
            const result = await postComments.find(filter).toArray();
            res.send(result)
        })
        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postComments.find(query).toArray();
            res.send(result)
        })
        app.post('/comments', async (req, res) => {
            const query = req.body;
            const result = await postComments.insertOne(query);
            res.send(result)
        })

        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const postId = { _id: ObjectId(id) }
            const postData = await postsData.findOne(postId);
            // console.log(postData);
            res.send(postData);
        })
        app.post('/post/:id', async (req, res) => {
            const id = req.params.id;
            const reactCount = Number(req.query.react);
            const query = {}
            console.log(reactCount);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    react: reactCount
                }
            }
            // const data = await postsData.updateOne(filter, updateDoc, options);
            const data = await postsData.updateOne(filter, updateDoc, options);
            console.log(data);
            res.send(data);
        })
        // comment 
        app.post('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.query.comment;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    react: query
                }
            }
            const data = await postComments.updateOne(filter, updateDoc, options);
            res.send(data);
        })
        app.post('/post', async (req, res) => {
            const query = req.body;
            const data = await postsData.insertOne(query)
            res.send(data)
        })


    }
    finally {

    }
}

run().catch(e => console.log(e))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
