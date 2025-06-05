const request = require('supertest');
const app = require('../app'); // Adjust if split into modules

describe('Data Ingestion API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll(done => {
    server.close(done);
  });

  it('should create a new ingestion', async () => {
    const res = await request(server)
      .post('/ingest')
      .send({ ids: [1, 2, 3, 4, 5], priority: 'MEDIUM' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ingestion_id');
  });

  it('should return status of ingestion', async () => {
    const res = await request(server)
      .post('/ingest')
      .send({ ids: [10, 11, 12], priority: 'HIGH' });

    const ingestionId = res.body.ingestion_id;
    const status = await request(server).get(`/status/${ingestionId}`);

    expect(status.statusCode).toBe(200);
    expect(status.body).toHaveProperty('batches');
  });
});
