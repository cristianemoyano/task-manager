export interface IBoard {
  _id: string;
  name: string;
  user_id: string;
  columns: IColumn[];
}

export interface IColumn {
  _id: string;
  name: string;
  tasks: ITask[];
}

export interface IPriority{
  _id: string;
  name: string;
}

export interface ITask {
  _id: string;
  track_id: string;
  priority: string;
  assignee: string;
  title: string;
  description: string;
  status: string;
  subtasks: ISubtask[];
  comments: IComment[];
  board_id?: string;
  is_closed: boolean;
  project_id: string;
}

export interface IProject {
  _id: string;
  track_id: string;
  priority: string;
  assignee: string;
  title: string;
  description: string;
  status: string;
  comments: IComment[];
  is_closed: boolean;
}

export interface ISubtask {
  _id: string;
  title: string;
  isCompleted: boolean;
}

export interface IComment {
  _id: string;
  value: string;
  author: string;
  date: string;
  authorEmail: string,
  authorName: string,
}

export interface IUser {
  _id: any;
  name: string;
  email: string;
  password: string;
}
