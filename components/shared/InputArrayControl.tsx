import React from 'react';
import Image from 'next/image';
import { FieldError } from 'react-hook-form';

interface Props {
  onChange: (value: any) => void;
  value: string | undefined;
  error: FieldError | undefined;
  remove: (value: any) => void;
  placeholder?: string;
}

export default function InputArrayControl({
  onChange,
  value,
  error,
  remove,
  placeholder,
}: Props) {
  return (
    <div className='input__array__control'>
      <input
        type='text'
        className={error ? 'input__text error' : 'input__text'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className='input__array__error'>{error?.message}</p>
      <button onClick={remove} className='input__array__delete' type='button'>
        <Image
          src='/assets/icon-cross.svg'
          width={15}
          height={15}
          layout='fixed'
          alt='cross'
        />
      </button>
    </div>
  );
}
