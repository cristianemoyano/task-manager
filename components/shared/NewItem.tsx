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
      <h1 className='board__new__title'>
        + New {isColumn ? 'Column' : 'Task'}
      </h1>
    </article>
  );
}
