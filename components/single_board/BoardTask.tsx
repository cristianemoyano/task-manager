import React, { useEffect, useState } from 'react';

import { ITask } from '@/typing';
import Image from 'next/image';
import useModal from '@/contexts/useModal';
import { ASSIGNEES, OF, SUB_TASKS } from '../constants';
import { getInitials } from '@/services/utils';

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

  const assigneeColor = task.assignee === "0" ? "bg-gray-400" : "bg-indigo-400"

  const priorityColors = [
    'bg-gray-300',
    'bg-yellow-400',
    'bg-red-500',
  ]

  return (
    <>
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

        <div className="grid grid-cols-3 gap-4 mt-3 items-center">
          <div className="...">



            <div className="grid grid-cols-4 gap-4 items-center">
              <div>
                {/* Priority */}
                <div title="Prioridad" className={`w-3 h-3 flex items-center justify-center font-bold  text-white rounded-full ${priorityColors[Number(task.priority)]} text-white`}>
                </div>
              </div>
              {task.comments.length > 0 ? (
                <>
              <div>
                <Image
                  src='/assets/comment.svg'
                  width={15}
                  height={24}
                  layout='fixed'
                  alt='comments'
                  className='register__logo'
                /> 
              </div>
              <div className='text-xs'>({task.comments.length})</div>
              </>) : ""}
            </div>

          </div>
          <div className=""></div>
          <div className="justify-self-end">
            <div className={`w-7 h-7 flex items-center justify-center rounded-full ${assigneeColor} text-white`}>
              <span className="text-sm font-bold">{getInitials(task.assignee === "0" ? "?" : `${ASSIGNEES.find((c) => c._id === task.assignee)?.name}`)}</span>
            </div>
          </div>
        </div>


      </article>
    </>
  );
}
