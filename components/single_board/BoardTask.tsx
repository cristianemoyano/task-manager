import React, { useEffect, useState } from 'react';

import { ITask } from '@/typing';
import useModal from '@/contexts/useModal';
import { ASSIGNEES, OF, SUB_TASKS } from '../constants';
import { getInicials } from '@/services/utils';

export default function BoardTask({ task }: { task: ITask }) {
  const { setTaskInfosModalContent, toggleTaskInfosModal } = useModal();
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);

  useEffect(() => {
    setSubtasksCompleted(
      task.subtasks.reduce((acc, curr) => {
        curr.isCompleted && (acc += 1);
        return acc;
      }, 0)
    );
  }, [task]);

  return (
    <article
      className='board__task relative'
      onClick={() => {
        setTaskInfosModalContent(task);
        toggleTaskInfosModal();
      }}
    >
      <h3 className='board__task__title'>{task.title}</h3>
      <p className='board__task__text'>
        {SUB_TASKS} ({subtasksCompleted} {OF} {task.subtasks.length})
      </p>

      {/* ASSIGNEE */}
      <div className="absolute bottom-0 right-0 mb-4 mr-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-400 text-white">
          <span className="text-md font-bold">{getInicials(`${ASSIGNEES.find((c) => c._id === task.assignee)?.name}`)}</span>
        </div>
      </div>

    </article>
  );
}
