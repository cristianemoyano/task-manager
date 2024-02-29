import { useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';

import { useRouter } from 'next/router';
import { mutate } from 'swr';

import useModal from '@/contexts/useModal';
import { IBoard, ITask } from '@/typing';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';
import { BOARD_COLUMNS, BOARD_NAME, EDIT_BOARD, NEW_BOARD, NEW_COLUMN, SAVE } from '../constants';

interface IControllerColumn {
  _id?: string;
  name: string;
  tasks: ITask[] | [];
}

interface IControllerBoard {
  name: string;
  columns: IControllerColumn[];
}

const defaultValues = {
  name: '',
  columns: [
    { name: 'Pendiente', tasks: [] },
    { name: 'En progreso', tasks: [] },
    { name: 'Realizado', tasks: [] },
  ],
};

export default function BoardModal({ board, user_id }: { board?: IBoard, user_id:string }) {

  const { isBoardModalOpen, toggleBoardModal, isNewBoard } = useModal();
  const router = useRouter();
  const { control, handleSubmit, reset, setValue } = useForm<IControllerBoard>({
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  useEffect(() => {
    if (!isNewBoard && board) {
      setValue('name', board.name);
      setValue('columns', board.columns);
    } else {
      setValue('name', '');
      setValue('columns', [
        { name: 'Pendiente', tasks: [] },
        { name: 'En progreso', tasks: [] },
        { name: 'Realizado', tasks: [] },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewBoard, board]);

  const onSubmit: SubmitHandler<IControllerBoard> = async (data) => {
    if (isNewBoard) {
      const newBoard = await axios.post(`/api/boards?user_id=${user_id}`, {
        board: data,
      });

      router.push(`/board/${newBoard.data._id}`);
      mutate(`/api/boards?user_id=${user_id}`);
    } else {
      await axios.patch(`/api/boards/${board!._id}?user_id=${user_id}`, {
        ...data,
      });
      mutate(`/api/boards/${board!._id}?user_id=${user_id}`);

      if (board?.name !== data.name) {
        mutate(`/api/boards?user_id=${user_id}`);
      }
    }
    toggleBoardModal();
  };

  return (
    <Modal
      isVisible={isBoardModalOpen}
      close={() => {
        toggleBoardModal();
        if (isNewBoard) {
          reset(defaultValues);
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='modal__header'>
          <h3 className='modal__header__title'>
            {isNewBoard ? NEW_BOARD : EDIT_BOARD}
          </h3>
        </header>
        <Controller
          control={control}
          name='name'
          rules={{ required: "can't be empty" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputTextControl
              onChange={onChange}
              value={value}
              error={error}
              name='name'
              label={BOARD_NAME}
              placeholder='e.g. Web Design'
            />
          )}
        />
        <div className='input__array__container'>
          <label className='input__label'>{BOARD_COLUMNS}</label>
          <div className='input__array__fields'>
            {fields.map((column, id) => (
              <Controller
                key={column.id}
                control={control}
                defaultValue={column.name}
                name={`columns.${id}.name`}
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
            onClick={() => append({ name: '', tasks: [] })}
          >
            + {NEW_COLUMN}
          </button>
        </div>
        <button className='modal__button__primary__s' type='submit'>
          {isNewBoard ? NEW_BOARD : SAVE}
        </button>
      </form>
    </Modal>
  );
}
