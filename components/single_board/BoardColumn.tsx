import React from 'react';

import { IColumn } from '@/typing';
import BoardTask from './BoardTask';

export default function BoardColumn({ column }: { column: IColumn }) {
  return (
    <section className='board__column'>
      <h4 className='board__column__title'>
        {column.name} ({column.tasks.length})
      </h4>
      <div className='board__column__container'>
        {column.tasks.map((task) => (
          <BoardTask key={task._id} task={task} />
        ))}
      </div>
    </section>
  );
}
