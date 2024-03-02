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
    query: { text, assignee, priority },
  } = req;
  await connectMongo();

  if (method === 'GET') {
    try {
      const tasks = await searchTasks(String(text), String(assignee), String(priority))
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error)
      res.status(500).json(error);
    }
  }
}
