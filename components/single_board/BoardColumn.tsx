import React from 'react';

import { IColumn, IProject, IUser } from '@/typing';
import BoardTask from './BoardTask';
import NewItem from '../shared/NewItem';
import useModal from '@/contexts/useModal';

export default function BoardColumn({ column, users, projects }: { column: IColumn, users: IUser[], projects: IProject[] }) {
  const { toggleTaskModal, setTaskModalContent } = useModal();

  return (
    <section className='board__column'>
      <h4 className='board__column__title'>
        {column.name} ({column.tasks.length})
      </h4>
      <div className='board__column__container'>
        {column.tasks.length ? (
          column.tasks.map((task) => <BoardTask key={task._id} task={task} users={users} projects={projects}/>)
        ) : (
          <NewItem
            isColumn={false}
            onClick={() => {
              setTaskModalContent({ isNew: true, task: {} });
              toggleTaskModal();
            }}
          />
        )}
      </div>
    </section>
  );
}
