import { useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';
import { mutate } from 'swr';

import { IBoard, IColumn } from '@/typing';
import useModal from '@/contexts/useModal';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';
import InputDropdownControl from '../shared/InputDropdownControl';
import { ASSIGNEE, ASSIGNEES, DESCRIPTION, EDIT_TASK, NEW_SUBTASK, NEW_TASK, PRIORITIES, PRIORITY, SAVE, STATUS, SUBTASK_PLACEHOLDER, SUB_TASKS, TITLE, TRACK_ID } from '../constants';

interface IControllerSubtasks {
  _id?: string;
  title: string;
  isCompleted: boolean;
}

interface IControllerTask {
  title: string;
  track_id: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  subtasks: IControllerSubtasks[];
}

export default function TaskModal({ board, user_id }: { board: IBoard, user_id: string }) {

  const defaultValues = {
    title: '',
    track_id: '',
    priority: PRIORITIES.length ? PRIORITIES[0]._id!.toString() : '',
    assignee: ASSIGNEES.length ? ASSIGNEES[0]._id!.toString() : '',
    description: '',
    status: board.columns.length ? board.columns[0]._id!.toString() : '',
    subtasks: [
      { title: '', isCompleted: false },
    ],
  };

  const { control, handleSubmit, reset, register, setValue } =
    useForm<IControllerTask>({
      defaultValues,
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });
  const {
    isTaskModalOpen,
    taskModalContent: { isNew, task },
    toggleTaskModal,
  } = useModal();

  useEffect(() => {
    if (!isNew) {
      setValue('title', task.title!);
      setValue('track_id', task.track_id!)
      setValue('description', task.description!);
      setValue('status', task.status!);
      setValue('priority', task.priority!);
      setValue('assignee', task.assignee!);
      setValue('subtasks', task.subtasks!);

    } else {
      setValue('title', '');
      setValue('track_id', '');
      setValue('description', '');
      setValue(
        'status',
        board.columns.length ? board.columns[0]._id!.toString() : ''
      );
      setValue(
        'priority',
        PRIORITIES.length ? PRIORITIES[0]._id!.toString() : ''
      );
      setValue(
        'assignee',
        ASSIGNEES.length ? ASSIGNEES[0]._id!.toString() : ''
      );
      setValue('subtasks', [
        { title: '', isCompleted: false },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, task]);

  const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
    if (isNew) {
      await axios.patch(`/api/task/add-task?user_id=${user_id}`, {
        task: data,
        board_id: board._id,
        column_id: data.status,
      });
      reset(defaultValues);
    } else if (task.status === data.status) {
      await axios.patch(`/api/task/edit-task?user_id=${user_id}`, {
        task: data,
        board_id: board._id,
        column_id: task.status,
        task_id: task._id,
      });
    } else {
      await axios.delete(
        `/api/task/delete-task?board_id=${board._id}&user_id=${user_id}&column_id=${task.status}&task_id=${task._id}`
      );
      await axios.patch(`/api/task/add-task?user_id=${user_id}`, {
        task: data,
        board_id: board._id,
        column_id: data.status,
      });
    }
    mutate(`/api/boards/${board._id}?user_id=${user_id}`);
    toggleTaskModal();
  };

  return (
    <Modal
      isVisible={isTaskModalOpen}
      close={() => {
        toggleTaskModal();
        if (isNew) {
          reset(defaultValues);
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='modal__header'>
          <h4 className='modal__header__title'>
            {isNew ? NEW_TASK : EDIT_TASK}
          </h4>
        </header>

        <div className="grid grid-cols-3 gap-2">
          {/* COL 1 */}
          <div className='col-span-2'>
            <Controller
              control={control}
              name='title'
              rules={{ required: "Este campo es requerido." }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputTextControl
                  onChange={onChange}
                  value={value}
                  error={error}
                  name='name'
                  label={TITLE}
                  placeholder='Título de la tarea'
                />
              )}
            />

            <div className='input__textarea__control'>
              <label className='input__label'>{DESCRIPTION}</label>
              <textarea
                className='input__text input__textarea'
                placeholder='Aquí puedes detallar la tarea a realizar'
                {...register('description')}
              />
            </div>
            <div className=' input__array__container'>
              <label className='input__label'>{SUB_TASKS}</label>
              <div className='overflow-scroll h-32 border-solid border-2 border-gray-100 p-3 input__array__fields'>
                {fields.map((subtask, id) => (
                  <Controller
                    key={subtask.id}
                    control={control}
                    defaultValue={subtask.title}
                    name={`subtasks.${id}.title`}
                    rules={{ required: "Este campo es requerido." }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <InputArrayControl
                        onChange={onChange}
                        value={value}
                        error={error}
                        remove={() => remove(id)}
                        placeholder={SUBTASK_PLACEHOLDER}
                      />
                    )}
                  />
                ))}
              </div>
              <button
                className='modal__button__secondary'
                type='button'
                onClick={() => append({ title: '', isCompleted: false })}
              >
                + {NEW_SUBTASK}
              </button>
            </div>

            <button className='modal__button__primary__s' type='submit'>
              {isNew ? NEW_TASK : SAVE}
            </button>
          </div>
          {/* END COL 1 */}
          {/* COL 2 */}
          <div className='' >
            <Controller
              control={control}
              name='status'
              render={({ field: { onChange, value } }) => (
                <InputDropdownControl
                  onChange={onChange}
                  value={value}
                  label={STATUS}
                  columns={board.columns}
                />
              )}
            />

            <Controller
              control={control}
              {...register('priority')}
              render={({ field: { onChange, value } }) => (
                <InputDropdownControl
                  onChange={onChange}
                  value={value}
                  label={PRIORITY}
                  columns={PRIORITIES}
                />
              )}
            />

            <Controller
              control={control}
              {...register('assignee')}
              render={({ field: { onChange, value } }) => (
                <InputDropdownControl
                  onChange={onChange}
                  value={value}
                  label={ASSIGNEE}
                  columns={ASSIGNEES}
                />
              )}
            />

            <div className=''>
              <label className='input__label'>{TRACK_ID}</label>
              <input
                className='input__text input__text'
                placeholder='e.g. SP-2345234534'
                {...register('track_id')}
              />
            </div>


          </div>
          {/* END COL 2 */}
        </div>
      </form>
    </Modal>
  );
}
