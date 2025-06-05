const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { enqueueJob } = require('./queue');
const store = require('./store');
const startProcessor = require('./processor');

const app = express();
const port = process.env.port || 5000;

app.use(express.json());

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;

  if (!ids || !Array.isArray(ids) || !priority) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const ingestionId = uuidv4();
  enqueueJob(ingestionId, priority, ids);
  return res.json({ ingestion_id: ingestionId });
});

app.get('/status/:id', (req, res) => {
  const ingestion = store.ingestions[req.params.id];
  if (!ingestion) return res.status(404).json({ error: 'Not found' });

  return res.json(ingestion);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  startProcessor();
});
