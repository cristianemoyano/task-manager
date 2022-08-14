import { testApiHandler } from 'next-test-api-route-handler';

import { connect, closeAndReset } from '../db/utils/reset-db';
import { newBoard } from '../db/newBoard';
import boardsHandler from '@/pages/api/boards/index';
import singleBoardHandler from '@/pages/api/boards/[board_id]';

let initialBoards: any[] = [];

const user_id = '62f651c7693e2295d9a2d41f';

beforeAll(async () => {
  initialBoards = await connect();
});

afterAll(async () => {
  closeAndReset();
});

test('GET /api/boards get correct number and data of all boards ', async () => {
  await testApiHandler({
    handler: boardsHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveLength(2);
      expect(json[0].name).toBe('Marketing Plan');
    },
  });
});

test('POST /api/boards create a new board', async () => {
  await testApiHandler({
    handler: boardsHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board: newBoard,
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
      params.user_id = user_id;
      params.board_id = initialBoards[1]._id.toString();
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.name).toBe('Roadmap');
    },
  });
});

test('DELETE /api/boards/[board_id] delete a single board', async () => {
  await testApiHandler({
    handler: singleBoardHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
      params.board_id = initialBoards[1]._id.toString();
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
      });
      expect(res.status).toBe(200);
    },
  });
});

test('PATCH /api/boards/[board_id] update a single board', async () => {
  await testApiHandler({
    handler: singleBoardHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
      params.board_id = initialBoards[0]._id.toString();
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Marketing Plan',
          columns: [
            initialBoards[0].columns[0],
            initialBoards[0].columns[1],
            { name: 'Test Column', tasks: [] },
          ],
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.name).toBe('New Marketing Plan');
      expect(json.columns[2].name).toBe('Test Column');
    },
  });
});
