const store = require('./store');
const { getNextJob } = require('./queue');

function simulateFetch(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, data: 'processed' }), 1000);
  });
}

async function processJob(job) {
  const batch = store.ingestions[job.ingestionId].batches.find(b => b.batchId === job.batchId);
  batch.status = 'triggered';

  await Promise.all(job.ids.map(simulateFetch));

  batch.status = 'completed';

  // Update ingestion status
  const allStatuses = store.ingestions[job.ingestionId].batches.map(b => b.status);
  if (allStatuses.every(s => s === 'completed')) {
    store.ingestions[job.ingestionId].status = 'completed';
  } else if (allStatuses.some(s => s === 'triggered' || s === 'completed')) {
    store.ingestions[job.ingestionId].status = 'triggered';
  }
}

function startProcessor() {
  setInterval(async () => {
    const job = getNextJob();
    if (job) {
      await processJob(job);
    }
  }, 5000); // 1 batch every 5 seconds
}

module.exports = startProcessor;
