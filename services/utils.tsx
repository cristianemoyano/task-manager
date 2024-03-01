import { IBoard } from "@/typing";
import axios from "axios";

export const getInitials = (fullName: string) => {
    const words = fullName.split(' ');
    let initials = '';
    words.forEach((char: string) => {
        if (char.length > 0) {
            initials += char[0].toUpperCase();
        }
    });
    return initials;
}

export const getBoardAssignees = (board?:IBoard):String[] => {
    if (!board) {
        return []
    }
    return board.columns.map((col)=>{
        let assignees = col.tasks.map((task)=>{
          return task.assignee
        })
        return assignees
      }).flat().filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
}


export const fetcher = (url: string) => axios.get(url).then((res) => res.data);