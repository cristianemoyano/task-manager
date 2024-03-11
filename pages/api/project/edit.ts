import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import { IColumn, ITask } from '@/typing';
import { isEmpty } from 'lodash';
import Project from '@/models/projectModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, query } = req;
  await connectMongo();

  if (method === 'PATCH') {
    try {
      const { project, comment } = body;

      let projectRecord = await Project.findOne({
        _id: project._id,
      });

      if (!isEmpty(comment?.value)) {
        projectRecord.comments.push(comment)
      }

      projectRecord.title = project.title;
      projectRecord.track_id = project.track_id;
      projectRecord.priority = project.priority;
      projectRecord.assignee = project.assignee;
      projectRecord.description = project.description;
      projectRecord.status = project.status;
      projectRecord.is_closed = project.is_closed;
  
      await projectRecord.save();

      res.status(200).json(projectRecord);
    } catch (error) {
      console.error(error)
      res.status(500).json(error);
    }
  }
}
