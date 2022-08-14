import { testApiHandler } from 'next-test-api-route-handler';

import { connect, closeAndReset } from '../db/utils/reset-db';

import registerUserHandler from '@/pages/api/auth/register';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  closeAndReset();
});

test('POST /api/auth/register create a new user', async () => {
  await testApiHandler({
    handler: registerUserHandler,
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: 'test',
          email: 'test@test.test',
          password: 'test',
        }),
      });
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.name).toBe('test');
      expect(json.email).toBe('test@test.test');
    },
  });
});
