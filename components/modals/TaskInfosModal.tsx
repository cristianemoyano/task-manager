import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Controller,
  useForm,
  SubmitHandler,
  useFieldArray,
} from 'react-hook-form';

import useModal from '@/contexts/useModal';
import { IBoard, ISubtask } from '@/typing';
import Modal from '../shared/Modal';
import InputCheckboxControl from '../shared/InputCheckboxControl';
import InputDropdownControl from '../shared/InputDropdownControl';

interface IControllerTask {
  status: string;
  subtasks: ISubtask[];
}

export default function TaskInfosModal({ board }: { board: IBoard }) {
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);
  const {
    isTaskInfosModalOpen,
    toggleTaskInfosModal,
    taskInfosModalContent: { title, description, subtasks, status },
  } = useModal();
  const { control, handleSubmit, reset, setValue } = useForm<IControllerTask>({
    defaultValues: {
      status: status,
      subtasks: subtasks,
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
  }, [isTaskInfosModalOpen]);

  const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
    console.log(data);
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
            // onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
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
        </header>
        <p className='modal__text'>{description}</p>
        <div className='input__checkbox__container'>
          <p className='input__label'>
            Subtasks ({subtasksCompleted} of {subtasks?.length})
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
        {isTaskInfosModalOpen && (
          <Controller
            control={control}
            name='status'
            render={({ field: { onChange, value } }) => (
              <InputDropdownControl
                onChange={onChange}
                value={value}
                label='Current Status'
                columns={board.columns}
              />
            )}
          />
        )}
        <button className='modal__button__primary__s' type='submit'>
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
