/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IColumn } from '@/typing';

interface Props {
  onChange: (value: any) => void;
  value: string | undefined;
  label: string;
  columns: IColumn[];
}


export default function InputDropdownControl({
  onChange,
  value,
  label,
  columns,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = (evt:any, value: string) => {
    setIsDropdownOpen(false);
    onChange(value);
  };

  useEffect(function mount() {

    function onMouse(evt:any) {
      if (evt.target.attributes.typeof?.value == "dropdown") {
        return
      }
      if (isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }
    window.addEventListener('mousedown', onMouse, false);

    return function unMount() {
      window.removeEventListener('mousedown', onMouse, false);
    };
  });

  return (
    <div className='input__dropdown__control z-50'>
      <label className='input__label'>{label}</label>
      <div
        className={
          isDropdownOpen
            ? 'input__dropdown input__dropdown--open'
            : 'input__dropdown'
        }
      >
        <button
          className='input__dropdown__button'
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          type='button'
        >
          {columns?.find((c) => c._id === value)?.name}
          {isDropdownOpen ? (
            <Image
              src='/assets/icon-chevron-up.svg'
              width={10}
              height={7}
              layout='fixed'
              alt='chevron-up'
            />
          ) : (
            <Image
              src='/assets/icon-chevron-down.svg'
              width={10}
              height={7}
              layout='fixed'
              alt='chevron-down'
            />
          )}
        </button>
        <div className='input__dropdown__content overflow-y-auto max-h-40'>
          {columns?.map((item) => (
            <div
              className='dropdown__content__item'
              key={item._id}
              onClick={(evt) => handleClick(evt, item._id!.toString())}
            >
              <p className='dropdown__content__value' typeof="dropdown">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
