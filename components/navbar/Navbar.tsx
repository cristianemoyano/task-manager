import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// import { toggleNewTask } from '../../features/modal/modalSlice';
import BoardModal from './BoardModal';
import EditDropdown from './EditDropdown';
import { IBoard } from '@/typing';

export default function Navbar({ boards }: { boards: [IBoard] }) {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const { pathname } = useRouter();
  // const dispatch = useDispatch();

  return (
    <>
      <nav className='navbar'>
        <div className='navbar__container'>
          {/* logo */}
          <Link href='/' passHref>
            <a>
              <Image
                src='/assets/logo-mobile.svg'
                width={24}
                height={25}
                layout='fixed'
                alt='company-logo'
              />
            </a>
          </Link>
          {/* board name */}
          <h2 className='navbar__title'>home</h2>
          {/* board name input */}
          <div
            className='navbar__dropdown'
            onClick={() => setIsBoardModalOpen(!isBoardModalOpen)}
          >
            <h2 className='navbar__dropdown__title'>
              {pathname === '/' ? 'Choose your board' : 'Board'}
            </h2>
            {isBoardModalOpen ? (
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
          </div>
        </div>
        {pathname !== '/' && (
          <div className='navbar__container'>
            {/* add new task button */}
            <button
              className='navbar__add__button'
              // onClick={() => dispatch(toggleNewTask())}
            >
              <Image
                src='/assets/icon-add-task-mobile.svg'
                width={12}
                height={12}
                layout='fixed'
                alt='chevron-down'
                className='navbar__add__icon'
              />
              <h3 className='navbar__add__text'>+ Add New Task</h3>
            </button>
            {/* board button */}
            <button
              className='navbar__edit__buton'
              onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
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
          </div>
        )}
      </nav>
      <BoardModal
        isVisible={isBoardModalOpen}
        close={() => setIsBoardModalOpen(false)}
        boards={boards}
      />
      <EditDropdown
        isVisible={isEditDropdownOpen}
        close={() => setIsEditDropdownOpen(false)}
      />
    </>
  );
}
