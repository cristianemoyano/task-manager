import { Schema, model, models } from 'mongoose';

import { IProject } from '@/typing';
import { commentsSchema } from './boardModel';

const projectSchema = new Schema<IProject>({
    // _id: { type: Number, required: false },
    title: String,
    track_id: String,
    priority: String,
    assignee: String,
    description: String,
    status: String,
    comments: [commentsSchema],
    is_closed: Boolean,
  });


const Project = models?.Project || model<IProject>('Project', projectSchema);

export default Project;
