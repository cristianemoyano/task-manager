import { testApiHandler } from 'next-test-api-route-handler';

import boardsHandler from '@/pages/api/boards/index';

test('GET /api/boards get correct value', async () => {
  await testApiHandler({
    handler: boardsHandler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toEqual({ name: 'Mathis' });
    },
  });
});
