import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { user_id },
  } = req;
  await connectMongo();

  if (method === 'GET') {
    try {
      const boards = await Board.find({ user_id }).select(['-columns']);

      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === 'POST') {
    try {
      const { board } = body;

      const newBoard = await Board.create({ ...board, user_id });

      res.status(201).json(newBoard);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
