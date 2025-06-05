const store = require('./store');

function enqueueJob(ingestionId, priority, ids) {
  const createdAt = Date.now();
  const priorityMap = { HIGH: 1, MEDIUM: 2, LOW: 3 };

  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    const batch = ids.slice(i, i + 3);
    const batchId = `${ingestionId}-${i / 3}`;
    batches.push({ batchId, ids: batch, status: 'yet_to_start' });

    store.jobs.push({
      ingestionId,
      priority: priorityMap[priority],
      createdAt,
      batchId,
      ids: batch
    });
  }

  store.ingestions[ingestionId] = {
    ingestionId,
    status: 'yet_to_start',
    batches
  };
}

function getNextJob() {
  if (store.jobs.length === 0) return null;

  store.jobs.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.createdAt - b.createdAt;
  });

  return store.jobs.shift();
}

module.exports = { enqueueJob, getNextJob };
