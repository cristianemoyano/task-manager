import { COLUMN, NEW, TASK } from "../constants";

interface Props {
  isColumn: boolean;
  onClick: () => void;
}

export default function NewItem({ isColumn, onClick }: Props) {
  return (
    <article
      className={`board__new board__new__${isColumn ? 'column' : 'task'}`}
      onClick={onClick}
    >
      <span className='text-zinc-400 font-bold'>
        + {NEW} {isColumn ? COLUMN : TASK}
      </span>
    </article>
  );
}
