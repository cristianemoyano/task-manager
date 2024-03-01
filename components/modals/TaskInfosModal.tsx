import { useState, useEffect } from 'react';
import {
  Controller,
  useForm,
  SubmitHandler,
  useFieldArray,
} from 'react-hook-form';
import Image from 'next/image';
import axios from 'axios';
import { mutate } from 'swr';

import useModal from '@/contexts/useModal';
import { IBoard, ISubtask } from '@/typing';
import Modal from '../shared/Modal';
import InputCheckboxControl from '../shared/InputCheckboxControl';
import InputDropdownControl from '../shared/InputDropdownControl';
import TaskDropdown from './TaskDropdown';
import { ASSIGNEES, CURRENT_STATUS, OF, PRIORITIES, SAVE, SUB_TASKS } from '../constants';

interface IControllerTask {
  status: string;
  subtasks: ISubtask[];
}

export default function TaskInfosModal({ board, user_id }: { board: IBoard, user_id: string }) {
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);
  const {
    isTaskInfosModalOpen,
    toggleTaskInfosModal,
    taskInfosModalContent: { _id, title, track_id, priority, assignee, description, subtasks, status },
  } = useModal();
  const { control, handleSubmit, setValue } = useForm<IControllerTask>({
    defaultValues: {
      status,
      subtasks,
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'subtasks',
  });

  useEffect(() => {
    setValue('status', status!);
    setValue('subtasks', subtasks!);

    subtasks &&
      setSubtasksCompleted(
        subtasks.reduce((acc, curr) => {
          curr.isCompleted && (acc += 1);
          return acc;
        }, 0)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTaskInfosModalOpen]);

  const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
    if (status === data.status) {
      await axios.patch(`/api/task/edit-task?user_id=${user_id}`, {
        task: { title, description, track_id, priority, assignee, subtasks: data.subtasks },
        board_id: board._id,
        column_id: status,
        task_id: _id,
      });
    } else {
      await axios.delete(
        `/api/task/delete-task?board_id=${board._id}&user_id=${user_id}&column_id=${status}&task_id=${_id}`
      );
      await axios.patch(`/api/task/add-task?user_id=${user_id}`, {
        task: {
          title,
          description,
          track_id,
          priority,
          assignee,
          subtasks: data.subtasks,
          status: data.status,
        },
        board_id: board._id,
        column_id: data.status,
      });
    }

    mutate(`/api/boards/${board._id}?user_id=${user_id}`);
    toggleTaskInfosModal();
  };

  return (
    <Modal
      isVisible={isTaskInfosModalOpen}
      close={() => {
        toggleTaskInfosModal();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='modal__header modal__header__flex'>
          <h3 className='modal__header__title'>{title}</h3>


          <button
            className='navbar__edit__buton'
            type='button'
            onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
          >
            <Image
              src='/assets/icon-vertical-ellipsis.svg'
              width={5}
              height={20}
              layout='fixed'
              alt='vertical-ellipsis'
              className='navbar__dropdown__icon'
            />
          </button>
          <TaskDropdown
            close={() => {
              setIsTaskDropdownOpen(false);
              toggleTaskInfosModal();
            }}
            isVisible={isTaskDropdownOpen}
            task={{
              _id: _id!,
              title: title!,
              track_id: track_id!,
              priority: priority!,
              assignee: assignee!,
              description: description!,
              subtasks: subtasks!,
              status: status!,
            }}
          />
        </header>

        <div className="grid grid-cols-3 gap-2">
          {/* COL 1 */}
          <div className='col-span-2'>
    
            <p className='mb-4'>{description}</p>
            <div className='input__checkbox__container'>
              <p className='input__label'>
                {SUB_TASKS} ({subtasksCompleted} {OF} {subtasks?.length})
              </p>
              <div className='input__checkbox__list'>
                {subtasks &&
                  fields.map((subtask, id) => (
                    <Controller
                      key={subtask.id}
                      control={control}
                      defaultValue={subtask.isCompleted}
                      name={`subtasks.${id}.isCompleted`}
                      render={({ field: { value, onChange } }) => (
                        <InputCheckboxControl
                          onChange={onChange}
                          value={value}
                          name={subtask.title}
                        />
                      )}
                    />
                  ))}
              </div>
            </div>
            
            <button className='modal__button__primary__s' type='submit'>
              {SAVE}
            </button>
          </div>
          {/* END COL 1 */}

          {/* COL 2 */}
          <div >

          {isTaskInfosModalOpen && (
              <Controller
                control={control}
                name='status'
                render={({ field: { onChange, value } }) => (
                  <InputDropdownControl
                    onChange={onChange}
                    value={value}
                    label={CURRENT_STATUS}
                    columns={board.columns}
                  />
                )}
              />
            )}

            <p className='input__label'>
              Prioridad:
              <span className='modal__text'>
                {` ${PRIORITIES.find((c) => c._id === priority)?.name}`}
              </span>
            </p>

            <p className='input__label'>
              Asignado:
              <span className='modal__text'>
                {` ${ASSIGNEES.find((c) => c._id === assignee)?.name}`}
              </span>
            </p>
              

            <p className='input__label'>
            ID de trazabilidad:
              <span className='modal__text'>
              {track_id ? ` ${track_id}` : track_id}
              </span>
            </p>
            

          </div>
          {/* END COL 2 */}

        </div>



      </form>
    </Modal>
  );
}
