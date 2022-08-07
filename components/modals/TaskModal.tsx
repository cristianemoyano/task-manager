import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';

import useModal from '@/contexts/useModal';
import { ITask, IBoard } from '@/typing';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';
import InputDropdownControl from '../shared/InputDropdownControl';

interface Props {
  board: IBoard;
}

export default function TaskModal({ board }: Props) {
  const {
    isTaskModalOpen,
    taskModalContent: { isNew, task },
    toggleTaskModal,
  } = useModal();
  const { control, handleSubmit, reset, register } = useForm<ITask>({
    defaultValues: {
      title: isNew ? '' : task.title,
      description: isNew ? '' : task.description,
      status: isNew ? board.columns[0]._id!.toString() : task.status,
      subtasks: isNew
        ? [
            { title: '', isCompleted: false },
            { title: '', isCompleted: false },
          ]
        : task.subtasks,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });

  const onSubmit: SubmitHandler<ITask> = async (data) => {
    console.log(data);
  };

  return (
    <Modal
      isVisible={isTaskModalOpen}
      close={() => {
        toggleTaskModal();
        // TODO reset if isNewTask
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
