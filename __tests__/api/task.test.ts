import { testApiHandler } from 'next-test-api-route-handler';

import { connect, closeAndReset } from '../db/utils/reset-db';
import addTaskHandler from '@/pages/api/task/add-task';
import editTaskHandler from '@/pages/api/task/edit-task';
import deleteTaskHandler from '@/pages/api/task/delete-task';
import { taskToAdd } from '../db/taskToAdd';
import { taskToEdit } from '../db/taskToEdit';

let initialBoards: any[] = [];

const user_id = '62f651c7693e2295d9a2d41f';

beforeAll(async () => {
  initialBoards = await connect();
});

afterAll(async () => {
  closeAndReset();
});

test('PATCH /api/task/add-task create a new task', async () => {
  await testApiHandler({
    handler: addTaskHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board_id: initialBoards[0]._id.toString(),
          column_id: initialBoards[0].columns[1]._id.toString(),
          task: {
            ...taskToAdd,
            status: initialBoards[0].columns[1]._id.toString(),
          },
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      const task = json.columns[1].tasks[0];
      expect(task.title).toBe('Launch version one');
      expect(task.status).toBe(initialBoards[0].columns[1]._id.toString());
      expect(task.subtasks).toHaveLength(2);
    },
  });
});

test('PATCH /api/task/edit-task edit a task', async () => {
  await testApiHandler({
    handler: editTaskHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board_id: initialBoards[1]._id.toString(),
          column_id: initialBoards[1].columns[0]._id.toString(),
          task_id: initialBoards[1].columns[0].tasks[0]._id.toString(),
          task: taskToEdit,
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      const task = json.columns[0].tasks[0];
      expect(task.title).toBe('Launch version two');
      expect(task.description).toBe('Test description added');
      expect(task.subtasks).toHaveLength(2);
    },
  });
});

test('DELETE /api/task/delete-task delete a task', async () => {
  await testApiHandler({
    handler: deleteTaskHandler,
    paramsPatcher: (params) => {
      params.user_id = user_id;
      params.board_id = initialBoards[1]._id.toString();
      params.column_id = initialBoards[1].columns[0]._id.toString();
      params.task_id = initialBoards[1].columns[0].tasks[0]._id.toString();
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.columns[0].tasks).toHaveLength(1);
    },
  });
});
