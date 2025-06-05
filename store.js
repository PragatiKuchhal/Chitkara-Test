const store = {
  ingestions: {}, // { ingestion_id: { status, batches: [...] } }
  jobs: []         // Job queue
};

module.exports = store;
