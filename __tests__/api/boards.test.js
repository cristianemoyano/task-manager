import { testApiHandler } from 'next-test-api-route-handler';
import { MongoClient } from 'mongodb';

import boardsHandler from '@/pages/api/boards/index';
import singleBoardHandler from '@/pages/api/boards/[board_id]/index';
import addTaskToBoardHandler from '@/pages/api/boards/[board_id]/add-task';

import { initialBoards } from '../db/initialBoards';
import { newBoard } from '../db/newBoard';

let connection;
let db;

// reset MongoDB
// beforeAll(async () => {
//   let uri = process.env.MONGODB_URI;
//   let dbName = process.env.MONGODB_DB;

//   connection = await MongoClient.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   db = await connection.db(dbName);

//   await db.collection('boards').deleteMany({});

//   await db.collection('boards').insertMany(initialBoards);
// });

// afterAll(async () => {
//   await connection.close();
// });

test('GET /api/boards get correct number and data of all boards ', async () => {
  await testApiHandler({
    handler: boardsHandler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      console.log(json);
      expect(json).toHaveLength(2);
      expect(json[0].name).toBe('Marketing Plan');
    },
  });
});

test('POST /api/boards create a new board', async () => {
  await testApiHandler({
    handler: boardsHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'content-type': 'application/json', // Must use correct content type
        },
        body: JSON.stringify({
          ...newBoard,
        }),
      });
      expect(res.status).toBe(201);
    },
  });
});

test('GET /api/boards/[board_id] get a single board', async () => {
  await testApiHandler({
    handler: singleBoardHandler,
    paramsPatcher: (params) => {
      params.board_id = 3;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      console.log(json);
      expect(json.board.name).toBe('Platform Launch');
    },
  });
});

// test('PATCH /api/boards/[boardId]/add create a new task for a board', async () => {
//   await testApiHandler({
//     handler: addTaskToBoardHandler,
//     paramsPatcher: (params) => {
//       params.boardId = 3;
//     },
//     test: async ({ fetch }) => {
//       const res = await fetch({
//         method: 'PATCH',
//         headers: {
//           'content-type': 'application/json', // Must use correct content type
//         },
//         body: JSON.stringify({
//           column_name: 'Todo',
//           task: { msg: 'added to col' },
//         }),
//       });
//     },
//   });

//   await testApiHandler({
//     handler: singleBoardHandler,
//     paramsPatcher: (params) => {
//       params.boardId = 3;
//     },
//     test: async ({ fetch }) => {
//       const res = await fetch({ method: 'GET' });

//       const json = await res.json();
//       console.log(json.board.columns[0]);
//     },
//   });
// });
