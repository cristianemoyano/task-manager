import React from 'react';
import Image from 'next/image';
import { FieldError } from 'react-hook-form';

interface Props {
  onChange: (value: any) => void;
  value: string | undefined;
  error: FieldError | undefined;
  remove: (value: any) => void;
}

export default function InputArrayControl({
  onChange,
  value,
  error,
  remove,
}: Props) {
  return (
    <div className='input__array__control'>
      <input
        type='text'
        className='input__text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
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
