import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/services/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { boardId },
  } = req;
  const { db } = await connectToDatabase();

  if (method === 'GET') {
    try {
      const board = await db.collection('boards').findOne({ _id: boardId });

      res.status(200).json({ board });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === 'DELETE') {
  }
}
