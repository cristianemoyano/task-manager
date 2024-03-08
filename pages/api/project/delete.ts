import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Board from '@/models/boardModel';
import { IColumn, ITask } from '@/typing';
import Project from '@/models/projectModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  await connectMongo();

  if (method === 'DELETE') {
    try {
      const { project_id } = query;

      const result = await Project.deleteOne({ _id: project_id });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
