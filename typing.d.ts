export interface IBoard {
  _id: number | string;
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  _id: number | string;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  _id: number | string;
  title: string;
  description?: string;
  status: string;
  subtasks: ISubtask[];
}

export interface ISubtask {
  _id: number | string;
  title: string;
  isCompleted: boolean;
}
