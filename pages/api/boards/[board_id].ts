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
    query: { board_id, user_id },
  } = req;
  await connectMongo();

  if (method === 'GET') {
    try {
      const board = await Board.findOne({ _id: board_id, user_id });

      res.status(200).json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === 'DELETE') {
    try {
      const board = await Board.findOneAndDelete({ _id: board_id, user_id });

      res.status(200).json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === 'PATCH') {
    const { name, columns } = body;

    try {
      const board = await Board.findOneAndUpdate(
        { _id: board_id, user_id },
        { name, columns }
      );

      res.status(200).json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
