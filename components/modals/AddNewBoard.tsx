import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Modal from '../shared/Modal';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import InputTextControl from '../shared/InputTextControl';
import InputArrayControl from '../shared/InputArrayControl';

interface IAddNewBoard {
  name: string;
  columns: { name: string }[];
}

export default function AddNewBoard() {
  const { control, handleSubmit, reset } = useForm<IAddNewBoard>({
    defaultValues: {
      name: '',
      columns: [{ name: 'Todo' }, { name: 'Doing' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  const onSubmit: SubmitHandler<IAddNewBoard> = async (data) => {
    await axios.post('/api/boards', { board: data });
    reset({
      name: '',
      columns: [{ name: 'Todo' }, { name: 'Doing' }],
    });
  };

  return (
    <Modal
      // TODO
      isVisible={false}
      close={() => {
        // TODO close and reset
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className='modal__title'>Add New Board</h3>
        <div className='modal__group__container'>
          <Controller
            control={control}
            name='name'
            // TODO rules={}
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
        </div>
        <div className='modal__group__container'>
          <label className='modal__label'>Board Columns</label>
          <div>
            {fields.map((column, id) => (
              <div className='input__text__container' key={id}>
                <Controller
                  control={control}
                  defaultValue={column.name}
                  name={`columns.${id}.name`}
                  // TODO rules={}
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
              </div>
            ))}
          </div>
          <button
            className='modal__button__secondary'
            type='button'
            onClick={() => append({ name: '' })}
          >
            + Add New Column
          </button>
        </div>
        <button className='modal__button__primary__s' type='submit'>
          Create New Board
        </button>
      </form>
    </Modal>
  );
}
