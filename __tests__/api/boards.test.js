import { testApiHandler } from 'next-test-api-route-handler';
import mongoose from 'mongoose';

import boardsHandler from '@/pages/api/boards/index';
import singleBoardHandler from '@/pages/api/boards/[board_id]/index';
import addTaskHandler from '@/pages/api/boards/[board_id]/add-task';
import editTaskWithNoStatusHandler from '@/pages/api/boards/[board_id]/edit-task';

import Board from '@/models/boardModel';

import { initialBoards } from '../db/initialBoards';
import { newBoard } from '../db/newBoard';
import { taskToAdd } from '../db/taskToAdd';
import { taskToEditWithNoStatus } from '../db/taskToEditWithNoStatus';

beforeAll(async () => {
  mongoose.connect(process.env.MONGODB_URI);

  await Board.insertMany(initialBoards);
});

afterAll(async () => {
  await Board.deleteMany({});

  mongoose.connection.close();
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

test('PATCH /api/boards/[board_id]/add-task create a new task', async () => {
  await testApiHandler({
    handler: addTaskHandler,
    paramsPatcher: (params) => {
      params.board_id = 1;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          column_id: 2,
          task: taskToAdd,
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.columns[1].tasks).toHaveLength(1);
    },
  });
});

test('PATCH /api/boards/[board_id]/edit-task edit a task', async () => {
  await testApiHandler({
    handler: editTaskWithNoStatusHandler,
    paramsPatcher: (params) => {
      params.board_id = 2;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          column_id: 1,
          task_id: 1,
          task: taskToEditWithNoStatus,
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      const task = json.columns[0].tasks[0];
      expect(task.title).toEqual('Launch version two');
      expect(task.description).toEqual('Test description added');
      expect(task.subtasks[0].title).toEqual('Test launch');
    },
  });
});
