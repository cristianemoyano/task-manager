import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import axios from 'axios';

import useModal from '@/contexts/useModal';
import { IColumn, IBoard } from '@/typing';
import Modal from '../shared/Modal';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';

interface Props {
  isNewBoard: boolean;
  board?: IBoard;
}

interface IAddNewBoard {
  name: string;
  columns: IColumn[];
}

export default function BoardModal({ isNewBoard, board }: Props) {
  const { isBoardModalOpen, toggleBoardModal } = useModal();
  const { control, handleSubmit, reset } = useForm<IAddNewBoard>({
    defaultValues: {
      name: isNewBoard ? '' : board!.name,
      columns: isNewBoard
        ? [{ name: 'Todo' }, { name: 'Doing' }]
        : board!.columns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  const onSubmit: SubmitHandler<IAddNewBoard> = async (data) => {
    if (isNewBoard) {
      await axios.post('/api/boards', { board: data });
      reset({
        name: '',
        columns: [{ name: 'Todo' }, { name: 'Doing' }],
      });
    } else {
      await axios.patch(`/api/boards/${board!._id}`, { ...data });
      toggleBoardModal();
    }
  };

  return (
    <Modal
      isVisible={isBoardModalOpen}
      close={() => {
        toggleBoardModal();
        // TODO reset if isNewBoard
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className='modal__header'>
          <h3 className='modal__header__title'>
            {isNewBoard ? 'Add New Board' : 'Edit Board'}
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
              label='Board Name'
              placeholder='e.g. Web Design'
            />
          )}
        />
        <div className='input__array__container'>
          <label className='input__label'>Board Columns</label>
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
            + Add New Column
          </button>
        </div>
        <button className='modal__button__primary__s' type='submit'>
          {isNewBoard ? 'Create New Board' : 'Save Changes'}
        </button>
      </form>
    </Modal>
  );
}
