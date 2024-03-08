import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import { searchTasks } from '@/services/task';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { text, assignee, priority, track_id, is_closed },
  } = req;

  if (method === 'GET') {
    await connectMongo()
    try {
      const tasks = await searchTasks(String(text), String(assignee), String(priority), String(track_id), String(is_closed))
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error)
      res.status(500).json(error);
    }
  }
}
