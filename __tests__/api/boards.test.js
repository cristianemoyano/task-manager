import { testApiHandler } from 'next-test-api-route-handler';
import { MongoClient } from 'mongodb';

import boardsHandler from '@/pages/api/boards/index';
import { boardsDB } from '../db/boards';

let connection;
let db;

// reset MongoDB
beforeEach(async () => {
  let uri = process.env.MONGODB_URI;
  let dbName = process.env.MONGODB_DB;

  connection = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await connection.db(dbName);

  await db.collection('boards').remove({});

  await db.collection('boards').insertMany(boardsDB);
});

afterEach(async () => {
  await connection.close();
});

test('GET /api/boards get correct value', async () => {
  await testApiHandler({
    handler: boardsHandler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveLength(1);
    },
  });
});
