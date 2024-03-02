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
import { IBoard, ISubtask, IUser } from '@/typing';
import Modal from '../shared/Modal';
import InputCheckboxControl from '../shared/InputCheckboxControl';
import InputDropdownControl from '../shared/InputDropdownControl';
import TaskDropdown from './TaskDropdown';
import { COMMENTS, CURRENT_STATUS, OF, PRIORITIES, SAVE, SUB_TASKS } from '../constants';
import InputTextControl from '../shared/InputTextControl';
import { convertISOToReadableDate, getInitials } from '@/services/utils';

interface IControllerTask {
  status: string;
  comment: string,
  subtasks: ISubtask[];
}

export default function TaskInfosModal({ board, user_id, user, users }: { board: IBoard, user_id: string, user: IUser, users: IUser[] }) {
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);
  const {
    isTaskInfosModalOpen,
    toggleTaskInfosModal,
    taskInfosModalContent: { _id, title, track_id, priority, comments, assignee, description, subtasks, status },
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
    setValue('comment', "");

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
        task: { title, description, track_id, priority, assignee, comments, subtasks: data.subtasks },
        comment: {
          value: data.comment,
          author: String(user_id),
          authorName: user.name,
          authorEmail: user.email,
          date: new Date().toISOString(),
        },
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
          comments,
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

  const reversedComments = comments?.slice().reverse();

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
              comments: comments!,
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
              
              <div className='input__checkbox__list overflow-y-auto max-h-40'>
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
            {/* COMMENTS */}

            <p className='input__label'>
              {COMMENTS}
            </p>

            <div className="grid grid-cols-8 gap-2 items-center">
              <div className=' mb-3 flex justify-center'>
                <div title='Tareas sin asignar' className={`w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full bg-indigo-400 text-white mr-[-7px]`}>
                {getInitials(user?.name)}
                </div>
              </div>
              <div className='col-span-6'>
                <Controller
                  control={control}
                  name='comment'
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <InputTextControl
                      onChange={onChange}
                      value={value}
                      error={error}
                      name='comment'
                      label={""}
                      placeholder='Agregar un comentario...'
                    />
                  )}
                />
              </div>
              <div></div>
            </div>

            <div className="overflow-y-auto max-h-60 pb-6 mb-6 border rounded-sm border-solid border-indigo-50">
              {reversedComments?.map((comm, index) => {
                return (
                  <div key={index} className="grid grid-cols-8 gap-2 items-center pt-1">
                    <div className=' mb-3 flex justify-center'>
                      <div title='Tareas sin asignar' className={`w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full bg-indigo-400 text-white mr-[-7px]`}>
                        {getInitials(comm?.authorName)}
                      </div>
                    </div>
                    <div className='col-span-6 pb-3'>
                      <div className="grid grid-rows-2 grid-flow-col gap-2">
                        <div className='text-sm'>

                          <div className="grid grid-cols-2 gap-2">
                            <div className='font-bold'>{comm?.authorName ? comm.authorName : "Sin Nombre"}</div>
                            <div className='text-left'>
                              {convertISOToReadableDate(comm?.date)}
                            </div>
                          </div>
                        </div>
                        <div>{comm?.value}</div>
                      </div>

                    </div>
                    <div></div>
                  </div>
                )
              })}
            </div>

            {/* ENDCOMMENTS */}

            {/* SAVE */}
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
                {` ${users.find((c) => c._id === assignee)?.name}`}
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
