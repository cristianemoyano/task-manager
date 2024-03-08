import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Project from '@/models/projectModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;
  await connectMongo();

  if (method === 'PATCH') {
    try {
      const { project } = body;

      const projectRecord = await Project.create(project);

      res.status(200).json(projectRecord);
    } catch (error) {
      console.error(error)
      res.status(500).json(error);
    }
  }
}
