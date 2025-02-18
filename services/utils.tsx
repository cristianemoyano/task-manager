import { IBoard } from "@/typing";
import axios from "axios";
import { isEmpty } from "lodash";

export const getInitials = (fullName: string) => {
  if (isEmpty(fullName)) {
    return "NA"
  }
  const words = fullName.split(' ');
  let initials = '';
  words.forEach((char: string) => {
    if (char.length > 0 && initials.length < 2) {
      initials += char[0].toUpperCase();
    }
  });
  return initials;
}

export const getBoardAssignees = (board?: IBoard): String[] => {
  if (!board) {
    return []
  }
  return board.columns.map((col) => {
    let assignees = col.tasks.map((task) => {
      return task.assignee
    })
    return assignees
  }).flat().filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
}


export const fetcher = (url: string) => axios.get(url).then((res) => res.data);


export const filterTasksByAssignee = (board: IBoard, assigneeId: string, showClosed: boolean = false) => {
  if (isEmpty(board) || isEmpty(assigneeId) ) {
    return board
  }

  board.columns = board.columns.map(column => {
    column.tasks = column.tasks.filter(task => task.assignee === assigneeId && task.is_closed === showClosed);
    return column;
  });
  return board;
};

export const filterTasksByClosed = (board?: IBoard, showClosed: boolean = false) => {
  if (isEmpty(board) || showClosed) {
    return board
  }
  board.columns = board.columns.map(column => {
    column.tasks = column.tasks.filter(task => task.is_closed === showClosed);
    return column;
  });
  return board;
};



export const convertISOToReadableDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short' };
  return date.toLocaleString('es-AR', options);
}