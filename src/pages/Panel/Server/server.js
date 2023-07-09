/// This code has been hosted on. Glitch
///
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://c146mu1:QDRtxZRdr2vItzBA@slimpic1.t5ulew1.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/api/vtt_react', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('vtt_react');
    const collection = database.collection('userinfo');

    const documents = await collection.find().toArray();

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.close();
  }
});

app.post('/api/vtt_react', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('vtt_react');
    const collection = database.collection('userinfo');

    const document = req.body;

    await collection.insertOne(document);

    res.status(201).json({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.close();
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
