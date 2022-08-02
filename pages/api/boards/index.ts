import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/services/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const { db } = await connectToDatabase();

  if (method === 'GET') {
    const boards = await db.collection('boards').find().toArray();

    res.status(200).json(boards);
  }

  if (method === 'POST') {
    const board = body;

    const newBoard = await db.collection('boards').insertOne(board);

    res.status(201).json(newBoard);
  }
}
