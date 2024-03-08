import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import Project from '@/models/projectModel';
import { isEmpty } from 'lodash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { project_id },
  } = req;
  await connectMongo();

  if (method === 'GET') {
    try {
      let query:any = {}
      if (!isEmpty(project_id)) {
        query["_id"] = String(project_id)
      }
      const projects = await Project.find(query);

      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json(error);
    }
  }

}
