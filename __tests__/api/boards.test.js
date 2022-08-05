import { testApiHandler } from 'next-test-api-route-handler';

import boardsHandler from '@/pages/api/boards/index';
import singleBoardHandler from '@/pages/api/boards/[board_id]';
import { newBoard } from '../db/newBoard';

import { connect, closeAndReset } from '../db/utils/reset-db';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  closeAndReset();
});

test('GET /api/boards get correct number and data of all boards ', async () => {
  await testApiHandler({
    handler: boardsHandler,
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
      params.board_id = 3;
    },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.board.name).toBe('Platform Launch');
    },
  });
});

test('DELETE /api/boards/[board_id] delete a single board', async () => {
  await testApiHandler({
    handler: singleBoardHandler,
    paramsPatcher: (params) => {
      params.board_id = 2;
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
