export interface IBoard {
  _id: string;
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  _id: string;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: string;
  subtasks: ISubtask[];
}

export interface ISubtask {
  _id: string;
  title: string;
  isCompleted: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}
