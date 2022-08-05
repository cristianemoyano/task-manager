import { testApiHandler } from 'next-test-api-route-handler';

import addTaskHandler from '@/pages/api/task/add-task';
import editTaskHandler from '@/pages/api/task/edit-task';
import deleteTaskHandler from '@/pages/api/task/delete-task';
import { taskToAdd } from '../db/taskToAdd';
import { taskToEditWithNoStatus } from '../db/taskToEdit';

import { connect, closeAndReset } from '../db/utils/reset-db';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  closeAndReset();
});

test('PATCH /api/task/add-task create a new task', async () => {
  await testApiHandler({
    handler: addTaskHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board_id: 1,
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

test('PATCH /api/task/edit-task edit a task', async () => {
  await testApiHandler({
    handler: editTaskHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board_id: 2,
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

test('DELETE /api/task/delete-task delete a task', async () => {
  await testApiHandler({
    handler: deleteTaskHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          board_id: 2,
          column_id: 1,
          task_id: 1,
        }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.columns[0].tasks).toHaveLength(1);
    },
  });
});
