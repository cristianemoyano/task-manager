import { useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';
import { mutate } from 'swr';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';
import InputDropdownControl from '../shared/InputDropdownControl';

interface IControllerSubtasks {
  _id?: string;
  title: string;
  isCompleted: boolean;
}

interface IControllerTask {
  title: string;
  description: string;
  status: string;
  subtasks: IControllerSubtasks[];
}

interface Args {
  url: string;
  data: any;
}

async function fetcher(url: string, data: any) {
  axios.patch(url, data).then((res) => res.data);
}

// async function newfetcher(...args: [string, object]) {
//   fetch(...args).then((res) => res.json());
// }

export default function TaskModal({ board }: { board: IBoard }) {
  const defaultValues = {
    title: '',
    description: '',
    status: board.columns[0]._id!.toString(),
    subtasks: [
      { title: '', isCompleted: false },
      { title: '', isCompleted: false },
    ],
  };

  const {
    isTaskModalOpen,
    taskModalContent: { isNew, task },
    toggleTaskModal,
  } = useModal();

  const { control, handleSubmit, reset, register, setValue } =
    useForm<IControllerTask>({
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });

  useEffect(() => {
    if (!isNew) {
      setValue('title', task.title!);
      setValue('description', task.description!);
      setValue('status', task.status!);
      setValue('subtasks', task.subtasks!);
    } else {
      setValue('title', '');
      setValue('description', '');
      setValue('status', board.columns[0]._id!.toString());
      setValue('subtasks', [
        { title: '', isCompleted: false },
        { title: '', isCompleted: false },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, task]);

  const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
    if (isNew) {
      await fetcher('/api/task/add-task', {
        task: data,
        board_id: board._id,
        column_id: data.status,
      });
      setTimeout(() => mutate(`/api/boards/${board._id}`), 1000);
      reset(defaultValues);
    } else {
      if (task.status === data.status) {
        await axios.patch('/api/task/edit-task', {
          task: data,
          board_id: board._id,
          column_id: task.status,
          task_id: task._id,
        });
      } else {
        await axios.delete(
          `/api/task/delete-task?board_id=${board._id}&column_id=${task.status}&task_id=${task._id}`
        );
        await axios.patch('/api/task/add-task', {
          task: data,
          board_id: board._id,
          column_id: data.status,
        });
      }
    }
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
          <h3 className='modal__header__title'>
            {isNew ? 'Add New Task' : 'Edit Task'}
          </h3>
        </header>
        <Controller
          control={control}
          name='title'
          rules={{ required: "can't be empty" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputTextControl
              onChange={onChange}
              value={value}
              error={error}
              name='name'
              label='Title'
              placeholder='e.g. Take cooffe break'
            />
          )}
        />
        <div className='input__textarea__control'>
          <label className='input__label'>Description</label>
          <textarea
            className='input__text input__textarea'
            placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
            {...register('description')}
          />
        </div>
        <div className='input__array__container'>
          <label className='input__label'>Subtasks</label>
          <div className='input__array__fields'>
            {fields.map((subtask, id) => (
              <Controller
                key={subtask.id}
                control={control}
                defaultValue={subtask.title}
                name={`subtasks.${id}.title`}
                rules={{ required: "can't be empty" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <InputArrayControl
                    onChange={onChange}
                    value={value}
                    error={error}
                    remove={() => remove(id)}
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
            + Add New Column
          </button>
        </div>
        <Controller
          control={control}
          name='status'
          render={({ field: { onChange, value } }) => (
            <InputDropdownControl
              onChange={onChange}
              value={value}
              label='Status'
              columns={board.columns}
            />
          )}
        />
        <button className='modal__button__primary__s' type='submit'>
          {isNew ? 'Create Task' : ' Save Changes'}
        </button>
      </form>
    </Modal>
  );
}
